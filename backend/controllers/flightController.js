// ======================================================
// controllers/flightController.js
// ======================================================

const axios = require("axios");
const FlightBooking = require("../models/FlightBooking");

// ======================================================
// 1️⃣ SEARCH FLIGHTS
// ======================================================

exports.searchFlights = async (req, res) => {
    try {

        const {
            from,
            to,
            date,
            adults = 1,
            children = 0,
            infants = 0,
            cabinClass = "economy",
        } = req.query;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!from || !to || !date) {
            return res.status(400).json({
                success: false,
                message:
                    "From, To and Date are required",
            });
        }

        const adultCount = Number(adults);
        const childCount = Number(children);
        const infantCount = Number(infants);

        if (
            isNaN(adultCount) ||
            isNaN(childCount) ||
            isNaN(infantCount)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Passenger values must be numbers",
            });
        }

        if (adultCount < 1) {
            return res.status(400).json({
                success: false,
                message:
                    "At least 1 adult is required",
            });
        }

        if (
            childCount < 0 ||
            infantCount < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Children and infants cannot be negative",
            });
        }

        const totalPassengers =
            adultCount +
            childCount +
            infantCount;

        // ==========================================
        // PASSENGERS
        // ==========================================

        const passengersData = [];

        // Adults
        for (let i = 0; i < adultCount; i++) {
            passengersData.push({
                type: "adult",
            });
        }

        // Children
        for (let i = 0; i < childCount; i++) {
            passengersData.push({
                type: "child",
            });
        }

        // Infants
        for (let i = 0; i < infantCount; i++) {
            passengersData.push({
                type:
                    "infant_without_seat",
            });
        }

        // ==========================================
        // SEARCH FLIGHTS
        // ==========================================

        const response = await axios.post(
            "https://api.duffel.com/air/offer_requests",
            {
                data: {
                    slices: [
                        {
                            origin: from,
                            destination: to,
                            departure_date: date,
                        },
                    ],

                    passengers:
                        passengersData,

                    cabin_class:
                        cabinClass,

                    return_offers: true,

                    return_available_services:
                        true,
                },
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.DUFFEL_API_KEY}`,

                    "Duffel-Version":
                        "v2",

                    "Content-Type":
                        "application/json",
                },
            }
        );

        const offers =
            response?.data?.data?.offers || [];

        // ==========================================
        // FORMAT FLIGHTS
        // ==========================================

        const flights = offers.map(
            (offer) => {

                const segments =
                    offer?.slices?.[0]
                        ?.segments || [];

                const firstSegment =
                    segments?.[0];

                const lastSegment =
                    segments[
                    segments.length - 1
                    ];

                return {

                    offerId:
                        offer?.id,

                    passengers:
                        offer?.passengers?.map(
                            (
                                p,
                                index
                            ) => ({
                                passengerId:
                                    p?.id,

                                type:
                                    p?.type,

                                passengerNo:
                                    index + 1,
                            })
                        ),

                    totalPassengers:
                        offer?.passengers
                            ?.length || 0,

                    airline:
                        firstSegment
                            ?.operating_carrier
                            ?.name,

                    airlines: [
                        ...new Set(
                            segments.map(
                                (s) =>
                                    s
                                        ?.operating_carrier
                                        ?.name
                            )
                        ),
                    ],

                    flightNumber:
                        firstSegment?.operating_carrier_flight_number,

                    flightNumbers:
                        segments.map(
                            (s) =>
                                s?.operating_carrier_flight_number
                        ),

                    stops:
                        segments.length - 1,

                    cabinClass,

                    route: {
                        from: {
                            city:
                                firstSegment
                                    ?.origin
                                    ?.city_name,

                            code:
                                firstSegment
                                    ?.origin
                                    ?.iata_code,

                            terminal:
                                firstSegment?.departing_terminal ||
                                "N/A",
                        },

                        to: {
                            city:
                                lastSegment
                                    ?.destination
                                    ?.city_name,

                            code:
                                lastSegment
                                    ?.destination
                                    ?.iata_code,

                            terminal:
                                lastSegment?.arriving_terminal ||
                                "N/A",
                        },
                    },

                    timing: {
                        departure: {
                            scheduled:
                                firstSegment?.departing_at,
                        },

                        arrival: {
                            scheduled:
                                lastSegment?.arriving_at,
                        },
                    },

                    departure:
                        firstSegment?.departing_at,

                    arrival:
                        lastSegment?.arriving_at,

                    totalAmount:
                        offer?.total_amount,

                    currency:
                        offer?.total_currency,

                    price:
                        `${offer?.total_amount} ${offer?.total_currency}`,

                    services:
                        offer?.available_services || [],

                    status:
                        "scheduled",

                    segments,
                };
            }
        );

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            success: true,

            requestedPassengers: {
                adults:
                    adultCount,

                children:
                    childCount,

                infants:
                    infantCount,

                total:
                    totalPassengers,
            },

            cabinClass,

            totalFlights:
                flights.length,

            flights,
        });

    } catch (err) {

        console.log(
            err?.response?.data ||
            err.message
        );

        return res.status(500).json({
            success: false,

            message:
                err?.response?.data
                    ?.errors?.[0]
                    ?.message ||
                "Flight search failed",

            error:
                err?.response?.data ||
                err.message,
        });
    }
};

// ======================================================
// 2️⃣ GET SEAT MAP
// ======================================================

exports.getSeatMap =
    async (req, res) => {

        try {

            const {
                offerId,
                passengers,
                totalAmount,
                currency = "USD",
            } = req.body;

            // ==========================================
            // VALIDATION
            // ==========================================

            if (!offerId) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Offer ID is required",
                });
            }

            if (
                !passengers ||
                passengers.length === 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Passengers are required",
                });
            }

            if (!totalAmount) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Total amount is required",
                });
            }

            // ==========================================
            // FORMAT PASSENGERS
            // ==========================================

            const formattedPassengers =
                passengers.map(
                    (p) => ({

                        id:
                            p.passengerId ||
                            p.id,

                        type:
                            p.type ||
                            "adult",

                        title:
                            p.title ||
                            "mr",

                        given_name:
                            p.firstName,

                        family_name:
                            p.lastName,

                        born_on:
                            p.born_on,

                        gender:
                            p.gender,

                        email:
                            p.email,

                        phone_number:
                            p.phone.startsWith(
                                "+"
                            )
                                ? p.phone
                                : `+91${p.phone}`,
                    })
                );

            // ==========================================
            // CREATE TEMP ORDER
            // ==========================================

            const orderPayload = {

                data: {

                    type:
                        "hold",

                    selected_offers:
                        [offerId],

                    passengers:
                        formattedPassengers,

                    // payments: [
                    //     {
                    //         type:
                    //             "balance",

                    //         amount:
                    //             String(
                    //                 Number(
                    //                     totalAmount
                    //                 )
                    //             ),

                    //         currency,
                    //     },
                    // ],
                },
            };

            console.log(
                "SEAT MAP ORDER PAYLOAD",
                JSON.stringify(
                    orderPayload,
                    null,
                    2
                )
            );

            // ==========================================
            // CREATE ORDER
            // ==========================================

            const orderResponse =
                await axios.post(
                    "https://api.duffel.com/air/orders",
                    orderPayload,
                    {
                        headers: {

                            Authorization:
                                `Bearer ${process.env.DUFFEL_API_KEY}`,

                            "Duffel-Version":
                                "v2",

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            // ==========================================
            // ORDER
            // ==========================================

            const order =
                orderResponse
                    ?.data?.data;

            console.log(
                "TEMP ORDER CREATED",
                order?.id
            );

            // ==========================================
            // GET SEAT MAP
            // ==========================================

            const seatResponse =
                await axios.get(
                    `https://api.duffel.com/air/orders/${order.id}/seat_maps`,
                    {
                        headers: {

                            Authorization:
                                `Bearer ${process.env.DUFFEL_API_KEY}`,

                            "Duffel-Version":
                                "v2",
                        },
                    }
                );

            const seatMaps =
                seatResponse?.data
                    ?.data || [];

            // ==========================================
            // FORMAT SEATS
            // ==========================================

            const seats = [];

            seatMaps.forEach(
                (seatMap) => {

                    seatMap?.cabins?.forEach(
                        (cabin) => {

                            cabin?.rows?.forEach(
                                (row) => {

                                    row?.sections?.forEach(
                                        (
                                            section
                                        ) => {

                                            section?.elements?.forEach(
                                                (
                                                    element
                                                ) => {

                                                    // ONLY SEATS

                                                    if (
                                                        element?.type !==
                                                        "seat"
                                                    ) {
                                                        return;
                                                    }

                                                    const services =
                                                        element?.available_services ||
                                                        [];

                                                    let seatPrice = 0;

                                                    let seatCurrency =
                                                        "USD";

                                                    let serviceId =
                                                        null;

                                                    // ==========================================
                                                    // SEAT SERVICE
                                                    // ==========================================

                                                    if (
                                                        services.length > 0
                                                    ) {

                                                        const service =
                                                            services[0];

                                                        seatPrice =
                                                            Number(
                                                                service?.total_amount || 0
                                                            );

                                                        seatCurrency =
                                                            service?.total_currency ||
                                                            "USD";

                                                        serviceId =
                                                            service?.id || null;
                                                    }

                                                    // ==========================================
                                                    // PUSH SEAT
                                                    // ==========================================

                                                    seats.push({

                                                        seatId:
                                                            element?.id,

                                                        seatNumber:
                                                            element?.designator,

                                                        available:
                                                            element?.available,

                                                        cabin:
                                                            cabin?.cabin_class,

                                                        price:
                                                            seatPrice,

                                                        currency:
                                                            seatCurrency,

                                                        seatServiceId:
                                                            serviceId,

                                                        characteristics:
                                                            element?.characteristics || [],
                                                    });
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );

            // ==========================================
            // RESPONSE
            // ==========================================

            return res.status(200).json({

                success: true,

                tempOrderId:
                    order?.id,

                totalSeats:
                    seats.length,

                seats,
            });

        } catch (err) {

            console.log(
                "SEAT MAP ERROR",
                err?.response?.data ||
                err.message
            );

            return res.status(500).json({

                success: false,

                message:
                    err?.response?.data
                        ?.errors?.[0]
                        ?.message ||
                    "Seat map failed",

                error:
                    err?.response?.data ||
                    err.message,
            });
        }
    };

// ======================================================
// 3️⃣ BOOK FLIGHT
// ======================================================

exports.bookFlight =
    async (req, res) => {

        try {

            const {
                offerId,
                passengers,
                selectedSeats,
                payment,
                flight,
            } = req.body;

            // ==========================================
            // VALIDATION
            // ==========================================

            if (!offerId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Offer ID required",
                });
            }

            // ==========================================
            // PASSENGERS
            // ==========================================

            const duffelPassengers =
                passengers.map(
                    (p) => ({

                        id:
                            p.passengerId ||
                            p.id,

                        type:
                            p.type ||
                            "adult",

                        title:
                            p.title ||
                            "mr",

                        given_name:
                            p.firstName,

                        family_name:
                            p.lastName,

                        born_on:
                            p.born_on,

                        gender:
                            p.gender,

                        email:
                            p.email,

                        phone_number:
                            p.phone.startsWith("+")
                                ? p.phone
                                : `+91${p.phone}`,
                    })
                );

            // ==========================================
            // SEAT SERVICES
            // ==========================================

            const services = [];

            if (
                selectedSeats &&
                selectedSeats.length > 0
            ) {

                selectedSeats.forEach(
                    (seat) => {

                        if (
                            seat?.seatServiceId
                        ) {

                            services.push({
                                id:
                                    seat.seatServiceId,

                                quantity:
                                    1,
                            });
                        }
                    }
                );
            }

            // ==========================================
            // FINAL ORDER PAYLOAD
            // ==========================================

            const orderPayload = {
                data: {

                    type:
                        "instant",

                    selected_offers:
                        [offerId],

                    passengers:
                        duffelPassengers,

                    payments: [
                        {
                            type:
                                "balance",

                            amount:
                                payment?.amount,

                            currency:
                                payment?.currency ||
                                "USD",
                        },
                    ],
                },
            };

            // ==========================================
            // ADD SEAT SERVICES
            // ==========================================

            if (
                services.length > 0
            ) {
                orderPayload.data.services =
                    services;
            }

            // ==========================================
            // CREATE ORDER
            // ==========================================

            const response =
                await axios.post(
                    "https://api.duffel.com/air/orders",
                    orderPayload,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${process.env.DUFFEL_API_KEY}`,

                            "Duffel-Version":
                                "v2",

                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            const order =
                response?.data?.data;

            // ==========================================
            // SAVE BOOKING
            // ==========================================

            const booking =
                await FlightBooking.create({

                    offerId,

                    passengers,

                    selectedSeats,

                    payment,

                    flight,

                    duffelOrderId:
                        order?.id,

                    bookingStatus:
                        order?.status,
                });

            return res.status(201).json({
                success: true,

                booking,

                duffel:
                    order,
            });

        } catch (err) {

            console.log(
                err?.response?.data ||
                err.message
            );

            return res.status(500).json({
                success: false,

                message:
                    err?.response?.data
                        ?.errors?.[0]
                        ?.message ||
                    "Booking failed",
            });
        }
    };

// ======================================================
// 4️⃣ GET BOOKINGS
// ======================================================

exports.getBookings =
    async (req, res) => {

        const bookings =
            await FlightBooking.find()
                .sort({
                    createdAt: -1,
                });

        return res.json({
            success: true,
            bookings,
        });
    };

// ======================================================
// 5️⃣ GET SINGLE BOOKING
// ======================================================

exports.getSingleBooking =
    async (req, res) => {

        const booking =
            await FlightBooking.findById(
                req.params.id
            );

        return res.json({
            success: true,
            booking,
        });
    };
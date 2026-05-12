const axios = require("axios");
const FlightBooking = require("../models/FlightBooking");

// ✅ BOOK FLIGHT WITH SEAT SELECTION
exports.bookFlight = async (req, res) => {
    try {
        const {
            offerId,
            passenger,
            passengers,
            flight,
            payment,
            passengerId,
            selectedSeats,
        } = req.body;

        console.log(
            "REQ BODY:",
            JSON.stringify(
                req.body,
                null,
                2
            )
        );

        // ==================================================
        // ✅ VALIDATION
        // ==================================================

        if (!offerId) {
            return res.status(400).json({
                success: false,
                message:
                    "Offer ID is required",
            });
        }

        // ==================================================
        // ✅ PASSENGERS
        // ==================================================

        let passengerList = [];

        // ✅ MULTIPLE PASSENGERS
        if (
            passengers &&
            Array.isArray(passengers) &&
            passengers.length > 0
        ) {
            passengerList = passengers;
        }

        // ✅ SINGLE PASSENGER
        else if (passenger) {
            passengerList = [
                {
                    ...passenger,
                    id: passengerId,
                },
            ];
        }

        else {
            return res.status(400).json({
                success: false,
                message:
                    "Passenger details are required",
            });
        }

        // ==================================================
        // ✅ VALIDATE PASSENGERS
        // ==================================================

        for (const p of passengerList) {
            if (
                !p.id ||
                typeof p.id !== "string" ||
                !p.id.startsWith("pas_")
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Valid Duffel passenger ID is required",
                });
            }

            if (
                !p.firstName ||
                !p.lastName ||
                !p.email ||
                !p.phone ||
                !p.gender ||
                !p.born_on
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "All passenger fields are required",
                });
            }
        }

        // ==================================================
        // ✅ FORMAT PASSENGERS
        // ==================================================

        const duffelPassengers =
            passengerList.map((p) => {
                const formattedPhone =
                    p.phone.startsWith("+")
                        ? p.phone
                        : `+91${p.phone}`;

                return {
                    id: p.id,

                    title:
                        p.title || "mr",

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
                        formattedPhone,
                };
            });

        // ==================================================
        // ✅ SEAT SELECTION SERVICES
        // ==================================================

        const services = [];

        if (
            selectedSeats &&
            Array.isArray(selectedSeats) &&
            selectedSeats.length > 0
        ) {
            selectedSeats.forEach(
                (seat) => {
                    services.push({
                        id: seat.seatServiceId,
                        quantity: 1,
                    });
                }
            );
        }

        console.log(
            "SELECTED SEATS:",
            services
        );

        // ==================================================
        // ✅ CREATE DUFFEL ORDER
        // ==================================================

        const orderPayload = {
            data: {
                type: "instant",

                selected_offers: [
                    offerId,
                ],

                passengers:
                    duffelPassengers,

                payments: [
                    {
                        type: "balance",

                        amount:
                            payment?.amount ||
                            "0",

                        currency:
                            payment?.currency ||
                            "INR",
                    },
                ],
            },
        };

        // ✅ ADD SEAT SERVICES
        if (services.length > 0) {
            orderPayload.data.services =
                services;
        }

        console.log(
            "ORDER PAYLOAD:",
            JSON.stringify(
                orderPayload,
                null,
                2
            )
        );

        // ==================================================
        // ✅ DUFFEL API
        // ==================================================

        const response = await axios.post(
            "https://api.duffel.com/air/orders",
            orderPayload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

                    "Duffel-Version":
                        "v2",

                    "Content-Type":
                        "application/json",
                },
            }
        );

        console.log(
            "DUFFEL RESPONSE:",
            JSON.stringify(
                response.data,
                null,
                2
            )
        );

        const order =
            response.data?.data;

        // ==================================================
        // ✅ SAVE PASSENGERS
        // ==================================================

        const savedPassengers =
            passengerList.map((p) => {
                const formattedPhone =
                    p.phone.startsWith("+")
                        ? p.phone
                        : `+91${p.phone}`;

                return {
                    passengerId: p.id,

                    title:
                        p.title || "mr",

                    firstName:
                        p.firstName,

                    lastName:
                        p.lastName,

                    email:
                        p.email,

                    phone:
                        formattedPhone,

                    gender:
                        p.gender,

                    born_on:
                        p.born_on,
                };
            });

        // ==================================================
        // ✅ SAVE BOOKING
        // ==================================================

        const savedBooking =
            await FlightBooking.create({
                offerId,

                passengerId:
                    passengerList?.[0]
                        ?.id || null,

                passengers:
                    savedPassengers,

                passenger:
                    savedPassengers?.[0] ||
                    null,

                selectedSeats:
                    selectedSeats || [],

                flight: {
                    airline:
                        flight?.airline ||
                        "N/A",

                    flightNumber:
                        flight?.flightNumber ||
                        "N/A",

                    from: {
                        city:
                            flight?.from
                                ?.city ||
                            flight?.route
                                ?.from
                                ?.city ||
                            "N/A",

                        code:
                            flight?.from
                                ?.code ||
                            flight?.route
                                ?.from
                                ?.code ||
                            "N/A",
                    },

                    to: {
                        city:
                            flight?.to
                                ?.city ||
                            flight?.route
                                ?.to
                                ?.city ||
                            "N/A",

                        code:
                            flight?.to
                                ?.code ||
                            flight?.route
                                ?.to
                                ?.code ||
                            "N/A",
                    },

                    departureAt:
                        flight?.departureAt ||
                        flight?.timing
                            ?.departure
                            ?.scheduled ||
                        null,

                    arrivalAt:
                        flight?.arrivalAt ||
                        flight?.timing
                            ?.arrival
                            ?.scheduled ||
                        null,

                    price:
                        flight?.price ||
                        "N/A",
                },

                payment: {
                    amount:
                        payment?.amount ||
                        "0",

                    currency:
                        payment?.currency ||
                        "INR",

                    status: "paid",
                },

                duffelOrderId:
                    order?.id || null,

                bookingStatus:
                    order?.status ||
                    "confirmed",
            });

        // ==================================================
        // ✅ SUCCESS
        // ==================================================

        return res.status(201).json({
            success: true,

            message:
                "Flight booked successfully",

            booking:
                savedBooking,

            selectedSeats:
                selectedSeats || [],

            duffel: order,
        });
    } catch (err) {
        console.log(
            "BOOKING ERROR:",
            err.response?.data ||
                err.message
        );

        return res.status(500).json({
            success: false,

            message:
                err.response?.data
                    ?.errors?.[0]
                    ?.message ||
                "Flight booking failed",

            error:
                err.response?.data ||
                err.message,
        });
    }
};

// ✅ GET ALL BOOKINGS
exports.getBookings = async (
    req,
    res
) => {
    try {
        const bookings =
            await FlightBooking.find().sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,

            count: bookings.length,

            bookings,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,

            message: err.message,
        });
    }
};

// ✅ GET SINGLE BOOKING
exports.getSingleBooking = async (
    req,
    res
) => {
    try {
        const booking =
            await FlightBooking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,

                message:
                    "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,

            booking,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,

            message: err.message,
        });
    }
};

// ✅ GET ALL BOOKINGS
exports.getBookings = async (
    req,
    res
) => {
    try {
        const bookings =
            await FlightBooking.find().sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,

            count: bookings.length,

            bookings,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,

            message: err.message,
        });
    }
};

// ✅ GET SINGLE BOOKING
exports.getSingleBooking = async (
    req,
    res
) => {
    try {
        const booking =
            await FlightBooking.findById(
                req.params.id
            );

        if (!booking) {
            return res.status(404).json({
                success: false,

                message: "Booking not found",
            });
        }

        return res.status(200).json({
            success: true,

            booking,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,

            message: err.message,
        });
    }
};
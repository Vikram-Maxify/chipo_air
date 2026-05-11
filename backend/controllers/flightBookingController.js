const axios = require("axios");
const FlightBooking = require("../models/FlightBooking");

// ✅ BOOK FLIGHT
exports.bookFlight = async (req, res) => {
    try {
        const {
            offerId,
            passenger,
            flight,
            payment,
            passengerId = "69e9e1839a7e932677d9e803"
        } = req.body;

        // ✅ VALIDATION
        if (!offerId) {
            return res.status(400).json({
                success: false,
                message: "Offer ID is required",
            });
        }

        if (!passengerId) {
            return res.status(400).json({
                success: false,
                message:
                    "Passenger ID is required",
            });
        }

        if (!passenger) {
            return res.status(400).json({
                success: false,
                message:
                    "Passenger details are required",
            });
        }

        if (
            !passenger.firstName ||
            !passenger.lastName ||
            !passenger.email ||
            !passenger.phone ||
            !passenger.gender ||
            !passenger.born_on
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All passenger fields are required",
            });
        }

        // ✅ DEFAULT TITLE
        const passengerTitle =
            passenger.title || "mr";

        // ✅ CREATE DUFFEL ORDER
        const response = await axios.post(
            "https://api.duffel.com/air/orders",
            {
                data: {
                    type: "instant",

                    // ✅ IMPORTANT
                    selected_offers: [offerId],

                    passengers: [
                        {
                            // ✅ IMPORTANT
                            id: passengerId,

                            title: passengerTitle,

                            given_name:
                                passenger.firstName,

                            family_name:
                                passenger.lastName,

                            born_on:
                                passenger.born_on,

                            gender:
                                passenger.gender,

                            email: passenger.email,

                            phone_number:
                                passenger.phone,
                        },
                    ],

                    payments: [
                        {
                            type: "balance",

                            amount:
                                payment?.amount || "0",

                            currency:
                                payment?.currency ||
                                "INR",
                        },
                    ],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,

                    "Duffel-Version": "v2",

                    "Content-Type":
                        "application/json",
                },
            }
        );

        const order = response.data?.data;

        // ✅ SAVE BOOKING
        const savedBooking =
            await FlightBooking.create({
                offerId,

                passengerId,

                passenger: {
                    title: passengerTitle,

                    firstName:
                        passenger.firstName,

                    lastName:
                        passenger.lastName,

                    email: passenger.email,

                    phone: passenger.phone,

                    gender:
                        passenger.gender,

                    born_on:
                        passenger.born_on,
                },

                flight: {
                    airline:
                        flight?.airline || "N/A",

                    flightNumber:
                        flight?.flightNumber ||
                        "N/A",

                    from: {
                        city:
                            flight?.from?.city ||
                            flight?.route?.from
                                ?.city ||
                            "N/A",

                        code:
                            flight?.from?.code ||
                            flight?.route?.from
                                ?.code ||
                            "N/A",
                    },

                    to: {
                        city:
                            flight?.to?.city ||
                            flight?.route?.to
                                ?.city ||
                            "N/A",

                        code:
                            flight?.to?.code ||
                            flight?.route?.to
                                ?.code ||
                            "N/A",
                    },

                    departureAt:
                        flight?.departureAt ||
                        flight?.timing?.departure
                            ?.scheduled ||
                        null,

                    arrivalAt:
                        flight?.arrivalAt ||
                        flight?.timing?.arrival
                            ?.scheduled ||
                        null,

                    price:
                        flight?.price || "N/A",
                },

                payment: {
                    amount:
                        payment?.amount || "0",

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

        // ✅ SUCCESS
        return res.status(201).json({
            success: true,

            message:
                "Flight booked successfully",

            booking: savedBooking,

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
                err.response?.data?.errors?.[0]
                    ?.message ||
                "Flight booking failed",
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
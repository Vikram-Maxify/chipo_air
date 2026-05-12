const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        // ==========================================
        // ✅ OFFER
        // ==========================================

        offerId: {
            type: String,
            default: "",
        },

        // ==========================================
        // ✅ MULTIPLE PASSENGERS
        // ==========================================

        passengers: [
            {
                id: {
                    type: String,
                    default: "",
                },

                title: {
                    type: String,
                    default: "mr",
                },

                firstName: {
                    type: String,
                    required: true,
                },

                lastName: {
                    type: String,
                    required: true,
                },

                email: {
                    type: String,
                    required: true,
                },

                phone: {
                    type: String,
                    required: true,
                },

                born_on: {
                    type: String,
                    required: true,
                },

                gender: {
                    type: String,

                    enum: ["m", "f"],

                    default: "m",
                },
            },
        ],

        // ==========================================
        // ✅ SELECTED SEATS
        // ==========================================

        selectedSeats: [
            {
                seatId: {
                    type: String,
                    default: "",
                },

                seatNumber: {
                    type: String,
                    default: "",
                },

                seatServiceId: {
                    type: String,
                    default: "",
                },

                passengerId: {
                    type: String,
                    default: "",
                },

                cabin: {
                    type: String,
                    default: "economy",
                },

                price: {
                    type: Number,
                    default: 0,
                },

                currency: {
                    type: String,
                    default: "INR",
                },
            },
        ],

        // ==========================================
        // ✅ FLIGHT DETAILS
        // ==========================================

        airline: {
            type: String,
            default: "",
        },

        flightNumber: {
            type: String,
            default: "",
        },

        from: {
            type: String,
            default: "",
        },

        to: {
            type: String,
            default: "",
        },

        // ==========================================
        // ✅ PRICE BREAKUP
        // ==========================================

        baseAmount: {
            type: Number,
            default: 0,
        },

        seatAmount: {
            type: Number,
            default: 0,
        },

        amount: {
            type: Number,

            required: true,

            default: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        // ==========================================
        // ✅ RAZORPAY
        // ==========================================

        razorpayOrderId: {
            type: String,
            default: "",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        razorpaySignature: {
            type: String,
            default: "",
        },

        // ==========================================
        // ✅ STATUS
        // ==========================================

        paymentStatus: {
            type: String,

            enum: [
                "created",
                "success",
                "failed",
            ],

            default: "created",
        },

        bookingStatus: {
            type: String,

            enum: [
                "pending",
                "confirmed",
                "failed",
            ],

            default: "pending",
        },

        errorMessage: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);
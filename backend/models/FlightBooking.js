const mongoose = require("mongoose");

const flightBookingSchema = new mongoose.Schema(
    {
        offerId: {
            type: String,
            required: true,
        },

        bookingReference: {
            type: String,
            default: () =>
                "BK" +
                Math.random()
                    .toString(36)
                    .substring(2, 10)
                    .toUpperCase(),
        },

        passenger: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            gender: String,
            born_on: String,
        },

        flight: {
            airline: String,
            flightNumber: String,

            from: {
                city: String,
                code: String,
            },

            to: {
                city: String,
                code: String,
            },

            departureAt: String,
            arrivalAt: String,

            price: String,
        },

        payment: {
            amount: String,
            currency: String,
            status: {
                type: String,
                default: "paid",
            },
        },

        duffelOrderId: String,

        bookingStatus: {
            type: String,
            default: "confirmed",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "FlightBooking",
    flightBookingSchema
);
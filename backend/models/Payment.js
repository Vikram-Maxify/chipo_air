const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        title: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        dob: String,
        gender: String,

        airline: String,
        flightNumber: String,
        from: String,
        to: String,

        amount: Number,

        currency: {
            type: String,
            default: "USD",
        },

        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,

        paymentStatus: {
            type: String,
            enum: ["created", "success", "failed"],
            default: "created",
        },

        bookingStatus: {
            type: String,
            enum: ["pending", "confirmed", "failed"],
            default: "pending",
        },

        errorMessage: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
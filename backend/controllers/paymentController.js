const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

// ✅ RAZORPAY INSTANCE
const razorpay = new Razorpay({
    key_id:
        process.env
            .RAZORPAY_KEY_ID,

    key_secret:
        process.env
            .RAZORPAY_KEY_SECRET,
});

// ======================================================
// ✅ CREATE PAYMENT WITH SEATS
// ======================================================

exports.createPayment =
    async (req, res) => {
        try {
            const {
                passengers,

                airline,

                flightNumber,

                from,

                to,

                amount,

                selectedSeats,

                offerId,
            } = req.body;

            console.log(
                "CREATE PAYMENT BODY:",
                JSON.stringify(
                    req.body,
                    null,
                    2
                )
            );

            // ==================================================
            // ✅ VALIDATION
            // ==================================================

            if (
                !passengers ||
                !Array.isArray(
                    passengers
                ) ||
                passengers.length ===
                    0
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Passengers are required",
                    });
            }

            if (
                !airline ||
                !flightNumber ||
                !from ||
                !to
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Flight details are required",
                    });
            }

            if (
                !amount ||
                isNaN(amount)
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Valid amount is required",
                    });
            }

            // ==================================================
            // ✅ VALIDATE PASSENGERS
            // ==================================================

            for (const p of passengers) {
                if (
                    !p.firstName ||
                    !p.lastName ||
                    !p.email ||
                    !p.phone ||
                    !p.born_on
                ) {
                    return res
                        .status(400)
                        .json({
                            success: false,

                            message:
                                "Passenger details are incomplete",
                        });
                }
            }

            // ==================================================
            // ✅ SEAT PRICE
            // ==================================================

            let seatAmount = 0;

            if (
                selectedSeats &&
                Array.isArray(
                    selectedSeats
                )
            ) {
                selectedSeats.forEach(
                    (seat) => {
                        seatAmount +=
                            Number(
                                seat.price ||
                                    0
                            );
                    }
                );
            }

            // ==================================================
            // ✅ TOTAL AMOUNT
            // ==================================================

            const finalAmount =
                Number(amount) +
                Number(seatAmount);

            console.log(
                "BASE FLIGHT:",
                amount
            );

            console.log(
                "SEAT PRICE:",
                seatAmount
            );

            console.log(
                "FINAL PRICE:",
                finalAmount
            );

            // ==================================================
            // ✅ RAZORPAY LIMIT FIX
            // ==================================================

            if (
                finalAmount >
                500000
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Amount exceeds Razorpay limit",
                    });
            }

            // ==================================================
            // ✅ CREATE ORDER
            // ==================================================

            const options = {
                amount:
                    Math.round(
                        finalAmount *
                            100
                    ),

                currency:
                    "INR",

                receipt: `receipt_${Date.now()}`,

                notes: {
                    airline,
                    flightNumber,
                    offerId:
                        offerId ||
                        "N/A",
                },
            };

            const order =
                await razorpay.orders.create(
                    options
                );

            // ==================================================
            // ✅ SAVE PAYMENT
            // ==================================================

            const payment =
                await Payment.create(
                    {
                        offerId,

                        passengers,

                        selectedSeats:
                            selectedSeats ||
                            [],

                        airline,

                        flightNumber,

                        from,

                        to,

                        baseAmount:
                            Number(
                                amount
                            ),

                        seatAmount,

                        amount:
                            finalAmount,

                        currency:
                            "INR",

                        razorpayOrderId:
                            order.id,

                        paymentStatus:
                            "created",

                        bookingStatus:
                            "pending",
                    }
                );

            // ==================================================
            // ✅ SUCCESS
            // ==================================================

            return res
                .status(200)
                .json({
                    success: true,

                    message:
                        "Payment order created",

                    key:
                        process
                            .env
                            .RAZORPAY_KEY_ID,

                    order,

                    payment,

                    priceBreakup:
                        {
                            flight:
                                Number(
                                    amount
                                ),

                            seats:
                                seatAmount,

                            total:
                                finalAmount,
                        },
                });
        } catch (error) {
            console.log(
                "CREATE PAYMENT ERROR:",
                error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        error?.error
                            ?.description ||
                        error.message,
                });
        }
    };

// ======================================================
// ✅ VERIFY PAYMENT
// ======================================================

exports.verifyPayment =
    async (req, res) => {
        try {
            const {
                razorpay_order_id,

                razorpay_payment_id,

                razorpay_signature,
            } = req.body;

            // ==================================================
            // ✅ VALIDATION
            // ==================================================

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Missing payment details",
                    });
            }

            // ==================================================
            // ✅ GENERATE SIGNATURE
            // ==================================================

            const generatedSignature =
                crypto
                    .createHmac(
                        "sha256",
                        process
                            .env
                            .RAZORPAY_KEY_SECRET
                    )
                    .update(
                        `${razorpay_order_id}|${razorpay_payment_id}`
                    )
                    .digest(
                        "hex"
                    );

            // ==================================================
            // ✅ FIND PAYMENT
            // ==================================================

            const payment =
                await Payment.findOne(
                    {
                        razorpayOrderId:
                            razorpay_order_id,
                    }
                );

            if (!payment) {
                return res
                    .status(404)
                    .json({
                        success: false,

                        message:
                            "Payment not found",
                    });
            }

            // ==================================================
            // ✅ VERIFY
            // ==================================================

            if (
                generatedSignature ===
                razorpay_signature
            ) {
                payment.paymentStatus =
                    "success";

                payment.bookingStatus =
                    "confirmed";

                payment.razorpayPaymentId =
                    razorpay_payment_id;

                payment.razorpaySignature =
                    razorpay_signature;

                await payment.save();

                return res
                    .status(200)
                    .json({
                        success: true,

                        message:
                            "Payment verified successfully",

                        payment,
                    });
            }

            // ==================================================
            // ✅ FAILED
            // ==================================================

            payment.paymentStatus =
                "failed";

            payment.bookingStatus =
                "failed";

            payment.errorMessage =
                "Signature verification failed";

            await payment.save();

            return res
                .status(400)
                .json({
                    success: false,

                    message:
                        "Payment verification failed",
                });
        } catch (error) {
            console.log(
                "VERIFY PAYMENT ERROR:",
                error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        error.message,
                });
        }
    };

// ======================================================
// ✅ PAYMENT FAILED
// ======================================================

exports.paymentFailed =
    async (req, res) => {
        try {
            const {
                razorpayOrderId,

                errorMessage,
            } = req.body;

            if (
                !razorpayOrderId
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Razorpay Order ID is required",
                    });
            }

            const payment =
                await Payment.findOne(
                    {
                        razorpayOrderId,
                    }
                );

            if (payment) {
                payment.paymentStatus =
                    "failed";

                payment.bookingStatus =
                    "failed";

                payment.errorMessage =
                    errorMessage ||
                    "Payment failed";

                await payment.save();
            }

            return res
                .status(200)
                .json({
                    success: true,

                    message:
                        "Payment marked as failed",
                });
        } catch (error) {
            console.log(
                "PAYMENT FAILED ERROR:",
                error
            );

            return res
                .status(500)
                .json({
                    success: false,

                    message:
                        error.message,
                });
        }
    };
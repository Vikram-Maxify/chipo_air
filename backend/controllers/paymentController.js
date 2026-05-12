const Razorpay = require("razorpay");

const crypto = require("crypto");

const Payment = require("../models/Payment");



// RAZORPAY INSTANCE
const razorpay = new Razorpay({
    key_id:
        process.env
            .RAZORPAY_KEY_ID,

    key_secret:
        process.env
            .RAZORPAY_KEY_SECRET,
});



// ================= CREATE PAYMENT =================
exports.createPayment =
    async (req, res) => {
        try {
            const {
                title,

                firstName,

                lastName,

                email,

                phone,

                dob,

                gender,

                airline,

                flightNumber,

                from,

                to,

                amount,
            } = req.body;



            // VALIDATION
            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !amount
            ) {
                return res
                    .status(400)
                    .json({
                        success: false,

                        message:
                            "Please fill all required fields",
                    });
            }



            // CREATE ORDER
            const options = {
                amount:
                    Math.round(
                        Number(
                            amount
                        ) * 100
                    ),

                currency:
                    "USD",

                receipt: `receipt_${Date.now()}`,
            };



            const order =
                await razorpay.orders.create(
                    options
                );



            // SAVE PAYMENT
            const payment =
                await Payment.create(
                    {
                        title,

                        firstName,

                        lastName,

                        email,

                        phone,

                        dob,

                        gender,

                        airline,

                        flightNumber,

                        from,

                        to,

                        amount,

                        currency:
                            "USD",

                        razorpayOrderId:
                            order.id,

                        paymentStatus:
                            "created",

                        bookingStatus:
                            "pending",
                    }
                );



            return res
                .status(200)
                .json({
                    success: true,

                    // SEND PUBLIC KEY
                    key:
                        process
                            .env
                            .RAZORPAY_KEY_ID,

                    order,

                    payment,
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
                        error.message,
                });
        }
    };



// ================= VERIFY PAYMENT =================
exports.verifyPayment =
    async (req, res) => {
        try {
            const {
                razorpay_order_id,

                razorpay_payment_id,

                razorpay_signature,
            } = req.body;



            // VALIDATION
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



            // GENERATE SIGNATURE
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



            // FIND PAYMENT
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



            // VERIFY SIGNATURE
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



            // FAILED
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



// ================= PAYMENT FAILED =================
exports.paymentFailed =
    async (req, res) => {
        try {
            const {
                razorpayOrderId,

                errorMessage,
            } = req.body;



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
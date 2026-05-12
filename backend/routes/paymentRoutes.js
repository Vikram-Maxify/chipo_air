const express = require("express");

const router = express.Router();

const {
  createPayment,
  verifyPayment,
  paymentFailed,
} = require("../controllers/paymentController");

router.post("/create-payment", createPayment);

router.post("/verify-payment", verifyPayment);

router.post("/payment-failed", paymentFailed);

module.exports = router;
const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });

    console.log("Mail Sent ✅");
  } catch (err) {
    console.log("Mail Error ❌", err);
  }
};

module.exports = sendMail;
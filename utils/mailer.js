// https://www.w3schools.com/nodejs/nodejs_email.asp

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const sendEmailVerification = (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: "Verify your email address",
    text: `To complete your registration for Link Tracker, please verify your email address using the verification code below:

        Your verification code: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Failed to send email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendEmailVerification;

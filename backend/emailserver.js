const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // FORCE IPv4 (fix Render connection issue)
  connectionTimeout: 10000,
});

async function sendBookingEmail(to, data) {
  try {
    await transporter.sendMail({
      from: `"Dinktøpia Booking Confirmation" <${process.env.EMAIL_USER}>`,
      to: to,
      bcc: process.env.ADMIN_EMAIL,

      subject: "🎾 Booking Confirmation",

      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>Booking Confirmed 🎉</h2>

          <p>Hi <b>${data.name}</b>,</p>

          <p>Your booking has been successfully reserved.</p>

          <h3>Booking Details:</h3>
          <ul>
            <li><b>Date:</b> ${data.date}</li>
            <li><b>Time:</b> ${data.time}</li>
            <li><b>Court:</b> ${data.court}</li>
          </ul>

          <p>Thank you for booking with us 🎾</p>
        </div>
      `,

      // 📸 FIXED SCREENSHOT ATTACHMENT
      attachments: data.screenshot
        ? [
            {
              filename: "payment-screenshot.jpg",
              content: fs.readFileSync(data.screenshot),
            },
          ]
        : [],
    });

    console.log("Email sent ✔");
  } catch (error) {
    console.error("Email error ❌", error);
  }
}

module.exports = sendBookingEmail;
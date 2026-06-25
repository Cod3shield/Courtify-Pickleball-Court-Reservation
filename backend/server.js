/* =========================================================
   🚀 PICKLEBALL BOOKING SERVER (MONGODB + EMAIL)
   FRONTEND → BACKEND → MONGODB → EMAIL FLOW
========================================================= */

require("dotenv").config();

/* =========================================================
   🟢 IMPORTS (TOP PART)
========================================================= */
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const sendBookingEmail = require("./emailserver");

const app = express();

/* =========================================================
   🟢 MULTER (SCREENSHOT UPLOAD)
========================================================= */
const upload = multer({ dest: "uploads/" });

/* =========================================================
   🟢 MIDDLEWARES
========================================================= */
app.use(cors());
app.use(express.static(__dirname));

/* =========================================================
   🟢 MONGODB CONNECTION
========================================================= */
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI ? "Loaded ✔" : "Missing ❌"
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.error("MongoDB Error ❌", err));

/* =========================================================
   🟢 BOOKING MODEL
========================================================= */
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  court: String,
  status: {
    type: String,
    default: "RESERVED",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

/* =========================================================
   🟢 TEST ROUTE
========================================================= */
app.get("/", (req, res) => {
  res.send("Booking Server Running 🚀");
});

/* =========================================================
   🚀 MAIN BOOKING ROUTE (WITH SCREENSHOT)
========================================================= */
app.post("/book", upload.single("screenshot"), async (req, res) => {
  try {

    console.log("BOOKING HIT");

    // 🔥 ADD THIS (IMPORTANT DEBUG)
    console.log("BODY:", req.body);
    console.log("FILE RECEIVED:", req.file);

    const { name, email, phone, date, slots } = req.body;

    const parsedSlots = JSON.parse(slots);

    if (!name || !email || !phone || !date || !parsedSlots.length) {
      return res.status(400).json({
        success: false,
        message: "Incomplete booking data",
      });
    }

    const screenshot = req.file;

    for (const slot of parsedSlots) {

      // await Booking.create({
      //   name,
      //   email,
      //   phone,
      //   date,
      //   time: slot.time,
      //   court: slot.court,
      //   status: "RESERVED",
      // });

      const newBooking = await Booking.create({
            name,
            email,
            phone,
            date,
            time: slot.time,
            court: slot.court,
            status: "RESERVED",
          });

      await sendBookingEmail(email, {
        name,
        date,
        time: slot.time,
        court: slot.court,
        screenshot: screenshot?.path
      });
    }

    return res.json({
      success: true,
      message: "Booking saved + Email sent ✔",
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* =========================================================
   🚀 GET ALL BOOKINGS
========================================================= */
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();

    const result = {};

    bookings.forEach((b) => {
      if (!result[b.date]) result[b.date] = {};

      const key = `${b.time}-${b.court}`;

      result[b.date][key] = {
        name: b.name,
        createdAt: b.createdAt,
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================================================
   🚀 START SERVER
========================================================= */
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running ✔");
});
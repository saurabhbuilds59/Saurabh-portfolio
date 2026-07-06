/**
 * L'Étoile Dorée - Luxury Fine Dining Restaurant Server
 * Production-Ready CommonJS Node.js & Express.js Backend
 */

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths relative to the backend/ folder
const frontendPath = path.join(__dirname, "../frontend");
const reservationsFile = path.join(__dirname, "reservations.json");

// Ensure reservations.json exists on start
if (!fs.existsSync(reservationsFile)) {
  fs.writeFileSync(reservationsFile, JSON.stringify([], null, 2), "utf-8");
}

/* ==========================================
   REST API: Request a Table Reservation
   ========================================== */
app.post("/api/reservations", (req, res) => {
  const { name, email, phone, guests, date, time, specialRequest } = req.body;

  // 1. Inputs validation
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter a valid name (at least 2 characters)." });
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Phone number validation
  const phoneRegex = /^[\d\s()+-]{7,20}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }

  // Seating capacity verification
  const parsedGuests = parseInt(guests, 10);
  if (isNaN(parsedGuests) || parsedGuests < 1 || parsedGuests > 8) {
    return res.status(400).json({ error: "Reservations must be between 1 and 8 guests." });
  }

  // Date validation
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "Please select a valid reservation date." });
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for date-only comparison
  
  if (selectedDate < today) {
    return res.status(400).json({ error: "Seating dates cannot be scheduled in the past." });
  }

  // Seating times validation
  const allowedTimes = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
  if (!time || !allowedTimes.includes(time)) {
    return res.status(400).json({ error: "Please select a valid, pre-defined seating time." });
  }

  // Build clean record schema
  const reservationRecord = {
    reservationId: `RES-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    guests: parsedGuests,
    date: date,
    time: time,
    specialRequest: (specialRequest || "").trim(),
    createdAt: new Date().toISOString()
  };

  try {
    // Read list atomically
    const fileData = fs.readFileSync(reservationsFile, "utf-8");
    const reservationsList = JSON.parse(fileData);

    // Append record
    reservationsList.push(reservationRecord);

    // Save list back
    fs.writeFileSync(reservationsFile, JSON.stringify(reservationsList, null, 2), "utf-8");

    // Return success
    return res.status(201).json({
      success: true,
      message: `Your table for ${parsedGuests} guest(s) on ${date} at ${time} has been successfully requested.`,
      reservationId: reservationRecord.reservationId,
      record: reservationRecord
    });

  } catch (error) {
    console.error("Concierge save database error:", error);
    return res.status(500).json({ error: "Our booking server experienced an error. Please retry or contact us directly." });
  }
});

// Serve static assets from frontend folder
app.use(express.static(frontendPath));

// Standard fallback routing for single-page style navigation
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`L'Étoile Dorée backend server is running on http://localhost:${PORT}`);
});

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

// Emulate __dirname since we are in ES Module type
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Paths
const frontendPath = path.join(__dirname, "frontend");
const backendDir = path.join(__dirname, "backend");
const reservationsFile = path.join(backendDir, "reservations.json");
const messagesFile = path.join(backendDir, "messages.json");

// Ensure backend directory and files exist on bootup
if (!fs.existsSync(backendDir)) {
  fs.mkdirSync(backendDir, { recursive: true });
}

if (!fs.existsSync(reservationsFile)) {
  fs.writeFileSync(reservationsFile, JSON.stringify([], null, 2), "utf-8");
}

if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, JSON.stringify([], null, 2), "utf-8");
}

/* ==========================================
   REST API Endpoint: Create a Reservation
   ========================================== */
app.post("/api/reservations", (req, res) => {
  const { name, email, phone, guests, date, time, specialRequest } = req.body;

  // 1. Validation checks
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter a valid name (at least 2 characters)." });
  }

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Phone validation (simple pattern check)
  const phoneRegex = /^[\d\s()+-]{7,20}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    return res.status(400).json({ error: "Please enter a valid phone number." });
  }

  // Number of guests validation
  const parsedGuests = parseInt(guests, 10);
  if (isNaN(parsedGuests) || parsedGuests < 1 || parsedGuests > 8) {
    return res.status(400).json({ error: "Reservations must be between 1 and 8 guests." });
  }

  // Date validation (must be valid and not in the past)
  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "Please select a valid reservation date." });
  }

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset clock for accurate day comparison
  
  if (selectedDate < today) {
    return res.status(400).json({ error: "Seating dates cannot be scheduled in the past." });
  }

  // Seating times validation
  const allowedTimes = ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
  if (!time || !allowedTimes.includes(time)) {
    return res.status(400).json({ error: "Please select a valid, pre-defined seating time." });
  }

  // Clean values
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
    // Read current file contents atomically
    const fileData = fs.readFileSync(reservationsFile, "utf-8");
    const reservationsList = JSON.parse(fileData);

    // Append new record
    reservationsList.push(reservationRecord);

    // Write back
    fs.writeFileSync(reservationsFile, JSON.stringify(reservationsList, null, 2), "utf-8");

    // Success response
    return res.status(201).json({
      success: true,
      message: `Your table for ${parsedGuests} guest(s) on ${date} at ${time} has been successfully requested.`,
      reservationId: reservationRecord.reservationId,
      record: reservationRecord
    });

  } catch (error) {
    console.error("Failed to persist reservation record:", error);
    return res.status(500).json({ error: "Our booking server experienced an error. Please retry or contact us directly." });
  }
});

/* ==========================================
   REST API Endpoint: Contact Messages
   ========================================== */

// Helper to send email notification to the developer using nodemailer
async function sendNotificationEmail(contactRecord: {
  messageId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.warn("[Nodemailer] Warning: EMAIL_USER and EMAIL_PASS environment variables are not set. The contact message was saved locally, but real email delivery is skipped. To receive email notifications, please set these credentials in your Secrets/Environment settings.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: `"${contactRecord.name} (via Portfolio)" <${emailUser}>`,
      to: "saurabhsen937@gmail.com",
      replyTo: contactRecord.email,
      subject: `[Portfolio Contact] ${contactRecord.subject}`,
      text: `You have received a new message from your portfolio contact form.

Sender Name: ${contactRecord.name}
Sender Email: ${contactRecord.email}
Message ID: ${contactRecord.messageId}
Received At: ${contactRecord.timestamp}

Message Content:
-------------------------------------------
${contactRecord.message}
-------------------------------------------

Best regards,
Your Automated Portfolio Node`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
          <h2 style="color: #00E5FF; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">New Portfolio Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Sender Name:</td>
              <td style="padding: 8px 0; color: #4b5563;">${contactRecord.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Sender Email:</td>
              <td style="padding: 8px 0; color: #4b5563;"><a href="mailto:${contactRecord.email}" style="color: #3b82f6; text-decoration: none;">${contactRecord.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Message ID:</td>
              <td style="padding: 8px 0; color: #9ca3af; font-family: monospace;">${contactRecord.messageId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">Received At:</td>
              <td style="padding: 8px 0; color: #4b5563;">${contactRecord.timestamp}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #00E5FF; background-color: #ffffff; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #374151;">Subject: ${contactRecord.subject}</p>
            <p style="margin: 0; color: #1f2937; line-height: 1.6; white-space: pre-wrap;">${contactRecord.message}</p>
          </div>
          <p style="margin-top: 30px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 15px;">
            This email was sent automatically from your Premium Cybernetic Portfolio platform.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[Nodemailer] Success: Notification email sent with Message ID:", info.messageId);
  } catch (err) {
    console.error("[Nodemailer] Error: Failed to transmit message notification email:", err);
  }
}

app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: "Please enter your name (at least 2 characters)." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!subject || subject.trim().length < 2) {
    return res.status(400).json({ error: "Please specify a subject for your message." });
  }

  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: "Please type a message of at least 5 characters." });
  }

  const contactRecord = {
    messageId: `MSG-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    timestamp: new Date().toISOString()
  };

  try {
    const fileData = fs.readFileSync(messagesFile, "utf-8");
    const messagesList = JSON.parse(fileData);
    messagesList.push(contactRecord);
    fs.writeFileSync(messagesFile, JSON.stringify(messagesList, null, 2), "utf-8");

    // Fire-and-forget email dispatch asynchronously
    sendNotificationEmail(contactRecord);

    return res.status(201).json({
      success: true,
      message: `Thank you, ${name.trim()}! Your message has been received. Saurabh will contact you soon.`,
      messageId: contactRecord.messageId
    });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return res.status(500).json({ error: "Our messaging backend encountered an error. Please try again." });
  }
});

/* ==========================================
   REST API Endpoint: Gemini Chatbot Assistant
   ========================================== */
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message content is required." });
  }

  const userMsg = message.trim();

  // Lazy initialize Gemini SDK client
  let geminiAi: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      geminiAi = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
    }
  }

  // System Instruction presenting Saurabh Sen's profile
  const systemInstruction = `
You are the Virtual AI Twin of Saurabh Sen, a passionate and elite Full Stack Web Developer and AI & Data Science Student.
Your task is to answer inquiries on behalf of Saurabh, acting as his friendly, confident, and highly skilled representative.

Profile Details about Saurabh Sen:
- Name: Saurabh Sen
- Current Role: Full Stack Web Developer & B.Tech AI & Data Science Student (Batch of 2024 - 2028)
- Institution: Shri Ram Institute of Technology, Jabalpur, Madhya Pradesh, India
- Technical Stack:
  * Frontend: HTML5, CSS3, JavaScript (ES6), React.js, Next.js, Tailwind CSS, Bootstrap
  * Backend: Node.js, Express.js, Django, REST APIs
  * Databases: MongoDB, MySQL, PostgreSQL, Firebase
  * Programming Languages: Python, JavaScript, SQL, C++
  * Development Tools: Git, GitHub, VS Code, Figma, Postman, Vercel, Netlify, Render
- Key Contacts:
  * Phone: +91 9301477386
  * Email: saurabhsen937@gmail.com
  * LinkedIn: https://www.linkedin.com/in/saurabh-sen-a257266376/
  * GitHub: https://github.com/saurabhbuilds59
  * Location: Jabalpur, Madhya Pradesh, India
- Personality: Smart, professional, forward-thinking, technically creative, engaging, and welcoming.

Response Guidelines:
1. Talk directly as Saurabh's AI twin.
2. Keep responses brief, polite, and scannable (usually 1 to 3 sentences in markdown, unless asked for comprehensive details).
3. If users ask about hiring, direct them to contact Saurabh at saurabhsen937@gmail.com or via the Contact Form.
4. Promote his skills in Web Development (full-stack) and Artificial Intelligence.
`;

  if (geminiAi) {
    try {
      // Reformat history if present to fit contents structure
      const formattedContents = [];
      
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          formattedContents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text }]
          });
        }
      }
      
      // Append latest message
      formattedContents.push({
        role: "user",
        parts: [{ text: userMsg }]
      });

      const response = await geminiAi.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 500
        }
      });

      if (response && response.text) {
        return res.json({ response: response.text });
      } else {
        throw new Error("No text response received from Gemini API");
      }
    } catch (apiError) {
      console.error("Gemini API call failed:", apiError);
      // Fallback to high-quality template response generator on API failure
    }
  }

  // Graceful mockup response when API Key is missing or service is unavailable
  const queryLower = userMsg.toLowerCase();
  let fallbackReply = `Hi there! I'm Saurabh's AI assistant. He is currently pursuing a B.Tech in Artificial Intelligence & Data Science and has advanced expertise in React, Node, and database integration. How can I help you today?`;

  if (queryLower.includes("hello") || queryLower.includes("hi") || queryLower.includes("hey")) {
    fallbackReply = `Hello! I'm Saurabh Sen's AI assistant. It's a pleasure to connect with you. Ask me anything about Saurabh's projects, technical skills, or professional experience!`;
  } else if (queryLower.includes("skill") || queryLower.includes("tech") || queryLower.includes("stack") || queryLower.includes("language")) {
    fallbackReply = `Saurabh is skilled across the full stack! His key tools include React, Next.js, Node.js, Express, Django, Python, C++, and databases like MongoDB, PostgreSQL, and Firebase.`;
  } else if (queryLower.includes("project") || queryLower.includes("build") || queryLower.includes("work")) {
    fallbackReply = `Saurabh has built several impressive projects including a Luxury Restaurant Website, a Developer Portfolio, E-Commerce platforms, and Business landing pages. You can find live links to them below!`;
  } else if (queryLower.includes("contact") || queryLower.includes("email") || queryLower.includes("phone") || queryLower.includes("hire") || queryLower.includes("call")) {
    fallbackReply = `You can easily hire or contact Saurabh! Call him at **+91 9301477386**, email **saurabhsen937@gmail.com**, or drop a message directly using the Contact Form on this page.`;
  } else if (queryLower.includes("education") || queryLower.includes("college") || queryLower.includes("university") || queryLower.includes("student")) {
    fallbackReply = `Saurabh is studying B.Tech in Artificial Intelligence & Data Science at **Shri Ram Institute of Technology** (2024-2028). He loves combining AI concepts with modern web applications!`;
  }

  return res.json({ response: fallbackReply });
});

// Serve static frontend assets
app.use(express.static(frontendPath));

// Fallback all other client-side routing request to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Boot listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`L'Étoile Dorée Express server is listening on port ${PORT}`);
});

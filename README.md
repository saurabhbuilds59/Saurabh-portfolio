<<<<<<< HEAD
# L'Étoile Dorée | Modern Luxury Restaurant Website

A premium, highly polished, and fully responsive luxury restaurant website with a gold and black theme. Built exactly to specifications using plain HTML5, CSS3, and Vanilla JavaScript on the frontend, and a Node.js with Express.js server on the backend.

## 🌟 Key Features

1. **Home Section**:
   - Full-screen high-fidelity luxury hero banner featuring an animated ambient panning effect.
   - Elegant, stylized display headings using *Cormorant Garamond* paired with modern high-contrast *Montserrat* tracking.
   - Smooth mouse scroll-down guidance anchor.

2. **About & Heritage**:
   - Compelling legacy stories detailing the century-long culinary philosophy.
   - Profile introducing Michelin-starred *Chef de Cuisine Jean-Luc Raymond* with inline gold-bordered frames and a floating statistics counter badge.

3. **Interactive Signature Menu**:
   - Handcrafted filter tab controller (Starters, Main Course, Desserts, Fine Drinks) operating via immediate, fluid JavaScript class lists.
   - Exquisite visual menu cards with hover zoom transitions, glow outlines, and custom tags.

4. **Visual Gallery Bento Grid**:
   - Responsive multi-aspect masonry-style bento grid featuring award-winning venue and culinary captures.
   - Interactive Lightbox Popup with smooth fade transitions, previous/next image navigation, and caption displays.

5. **Testimonials Slider**:
   - Custom, lightweight, touch-safe client-side slider operating entirely on custom JS intervals and animations (no bulky external packages or frameworks).
   - Star-rating markers and quick jump dot indicators.

6. **Concierge Table Reservations Form**:
   - Highly stylized input fields, secure seating capacity dropdowns, and date-restrictions guarding against historical dates.
   - Interactive AJAX POST communication sending reservation payloads securely to the REST API.
   - Beautiful success/error modal-style feedback inline banners with dynamic reference key generation (`RES-XXXXX`).

7. **Contact & Hours Section**:
   - Clean details columns for addresses, timing schedules, contact lines, and dress attire policies.
   - Elegant grayscaled/inverted Google Maps layout embedding.

---

## 📁 Project Structure

```text
luxury-restaurant/
│
├── frontend/
│   ├── index.html         # Main structural luxury HTML5 document
│   ├── style.css          # Customized gold/black responsive stylesheet
│   ├── script.js          # Interactive scrolling, filtering, slider, lightbox and booking handlers
│   └── images/            # Premium food, drink, venue, and chef visual assets
│       ├── hero.jpg       # Luxurious venue restaurant interior background
│       ├── chef.jpg       # Chef Jean-Luc Raymond plating photo
│       ├── wagyu.jpg      # Signature wagyu main course plate
│       └── cocktail.jpg   # Saffron gold-infused signature drink photo
│
├── backend/
│   ├── server.js          # Production-ready Express.js CommonJS server
│   ├── reservations.json  # Atomic local file database storing bookings
│   └── package.json       # Self-contained backend package configuration
│
├── server.ts              # Root TSX-compatible full-stack development entry point
├── package.json           # Root package manager configuration
└── README.md              # Installation and developer documentation
```

---

## 🚀 Running the Project

### Workspace Development (AI Studio Dev Server)
The development server is driven in this workspace by the root configuration:
1. Run local dependencies check:
   ```bash
   npm install
   ```
2. Start the integrated Express full-stack environment:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` to view the running live app.

### Running the Backend Independently
If you want to run only the pure JavaScript Node server directly:
1. Navigate into the backend directory:
   ```bash
   cd backend
   ```
2. Install minimal Express dependency:
   ```bash
   npm install
   ```
3. Start the Node.js process:
   ```bash
   npm start
   ```
4. Access the server at `http://localhost:3000`.

---

## 🛠️ API Documentation

### **Create Seating Reservation**
Submits a table booking request to the Express backend database.

- **URL**: `/api/reservations`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Payload Schema**:
  ```json
  {
    "name": "Lord Kensington",
    "email": "lord@kensington.com",
    "phone": "+1 (555) 019-2831",
    "guests": 2,
    "date": "2026-07-20",
    "time": "19:00",
    "specialRequest": "A quiet window table for our anniversary occasion."
  }
  ```

- **Successful Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Your table for 2 guest(s) on 2026-07-20 at 19:00 has been successfully requested.",
    "reservationId": "RES-K6X9H-4831",
    "record": { ... }
  }
  ```

- **Error Response (400 Bad Request)**:
  ```json
  {
    "error": "Reservations must be between 1 and 8 guests."
  }
  ```
=======
# 🚀 Saurabh Sen | Web Developer Portfolio

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Poppins&size=28&duration=3000&pause=1000&color=3B82F6&center=true&vCenter=true&width=700&lines=Full+Stack+Web+Developer;AI+%26+Data+Science+Student;Building+Modern+Web+Experiences" alt="Typing SVG" />
</p>

<p align="center">
  <a href="YOUR_PORTFOLIO_LINK">
    <img src="https://img.shields.io/badge/🌐 Live Portfolio-2563EB?style=for-the-badge" />
  </a>
  <a href="https://github.com/saurabhbuilds59">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/saurabh-sen-a257266376/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin" />
  </a>
</p>

---

## 👋 About Me

Hi, I'm **Saurabh Sen**, a passionate **Full Stack Web Developer** and **AI & Data Science Student**.

I enjoy building modern, responsive, and user-friendly web applications with clean UI and scalable architecture.

---

## 🛠 Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- React.js
- Next.js
- Tailwind CSS
- Bootstrap

### Backend
- Node.js
- Express.js
- Django

### Database
- MongoDB
- MySQL
- PostgreSQL
- Firebase

### Tools
- Git
- GitHub
- VS Code
- Postman
- Vercel
- Netlify

---

## 💼 Featured Projects

### 🍽 Luxury Restaurant Website
Modern luxury restaurant website with elegant UI and responsive design.

### 💻 Developer Portfolio
Personal portfolio with premium animations and modern UI.

### 🏢 Business Landing Page
Professional corporate landing page for a digital agency.

### 🛒 E-Commerce Website
Responsive online shopping website with modern interface.

---

## ✨ Features

- Responsive Design
- Modern UI/UX
- Fast Performance
- Clean Code
- SEO Friendly
- Cross Browser Compatible
- Mobile Friendly

---

## 📈 Currently Learning

- Advanced React
- Next.js
- Backend Development
- REST APIs
- System Design
- Cloud Deployment

---

## 📬 Connect With Me

📧 Email: your-email@example.com

📱 Phone: +91 XXXXXXXXXX

🌐 Portfolio: YOUR_PORTFOLIO_LINK

💼 LinkedIn:
https://www.linkedin.com/in/saurabh-sen-a257266376/

🐙 GitHub:
https://github.com/saurabhbuilds59

---

## ⭐ Support

If you like this project, don't forget to **Star ⭐ the repository**.

---

<p align="center">
Made with ❤️ by <b>Saurabh Sen</b>
</p>
>>>>>>> d735287f7b2844a26410876a406a22a307bb9bec

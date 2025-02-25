# Backend - Advanced Babysteps Appointment Booking System

## 📌 Project Overview
This backend service provides an API for managing doctor availability and patient appointments. It includes endpoints for retrieving doctors, computing available time slots, booking appointments, and handling real-time updates via Socket.IO.

## 🛠 Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Real-time Updates:** Socket.IO
- **Validation & Utilities:** Joi, date-fns/moment.js

---

## 🚀 Setup Instructions
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/project-name.git
cd project-name/backend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in the backend directory with the following details:
```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

### **4️⃣ Start the Server**
```bash
npm start
```
The backend will run on **http://localhost:5000**.
---

## 🔥 API Endpoints

### **🩺 Doctor Endpoints**
| Method | Route | Description |
|--------|-------|-------------|
| **GET** | `/doctors` | Retrieve all doctors |
| **GET** | `/doctors/:id/slots?date=YYYY-MM-DD` | Compute available slots for a doctor on a given date |

### **📅 Appointment Endpoints**
| Method | Route | Description |
|--------|-------|-------------|
| **GET** | `/appointments` | Retrieve all appointments |
| **GET** | `/appointments/:id` | Get details of a specific appointment |
| **POST** | `/appointments` | Create a new appointment (validates availability) |
| **PUT** | `/appointments/:id` | Update an existing appointment (ensures slot availability) |
| **DELETE** | `/appointments/:id` | Cancel an appointment |

---

## 🕒 Time Slot Calculation
- Doctors have fixed working hours.
- Available slots are computed by subtracting booked appointments.
- Appointments start at fixed intervals (e.g., every 30 minutes).
- Uses `date-fns` or `moment.js` for date-time calculations.

---

## ✅ Validation & Error Handling
- **Input Validation:** Uses Joi to validate request data.
- **Error Handling:** Centralized error handling with `express-async-handler`.
- **Status Codes:** Proper HTTP status codes returned for errors (400, 404, 500, etc.).

---

## 🔄 Real-Time Updates (Optional)
- Implements **Socket.IO** to notify clients in real-time when appointments are booked.
- Clients viewing available slots receive updates automatically.

---

## 📌 Deployment Instructions
- **MongoDB Atlas:** Ensure IP whitelisting is configured.
- **Backend Deployment:** Use **Render/Vercel/Fly.io**.
- **WebSocket Support:** Ensure host supports **Socket.IO**.




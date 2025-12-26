# RideWay - Bus Booking System

A full-stack bus booking platform for Sri Lanka with Node.js/Express backend and React/TypeScript frontend.

## 🚍 Overview

**RideWay** is a modern bus booking system designed for Sri Lankan travelers, inspired by leading platforms but with unique branding. The platform allows users to search for bus trips, view available journeys, and complete bookings seamlessly.

### Features

- 🔍 Search trips by origin, destination, and date
- 📅 Browse available bus journeys with real-time information
- 🎫 Complete booking flow with passenger details, tied to the logged-in user
- 🔐 JWT-based authentication with email verification
- 🧩 Role-based admin area to manage buses, trips, users, and bookings
- ✉️ Transactional emails via Resend (verification and notifications)
- 💳 Clean, intuitive UI with Material-UI
- 🗄️ MySQL database with Sequelize ORM
- 🎨 Modern design with custom RideWay branding

## 📁 Project Structure

```
Bus_Booking/
├── bus-booking-backend/    # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── server.js       # Entry point
│   │   └── seed.js         # Database seeding
│   └── package.json
│
└── bus-booking-frontend/   # React + TypeScript UI
    ├── src/
    │   ├── components/     # Navbar, Footer
    │   ├── pages/          # Home, Trips, Booking, etc.
    │   ├── services/       # API integration
    │   ├── theme.ts        # MUI theme
    │   └── App.tsx         # Main app + routing
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19+ or 22.12+ (for Vite compatibility)
- **MySQL** 5.7+ or 8.0+
- npm or yarn

### 1. Backend Setup

```bash
cd bus-booking-backend

# Install dependencies
npm install

# Create database
mysql -u root -p
CREATE DATABASE bus_booking;
EXIT;

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Start server
npm run dev
```

Backend runs on `http://localhost:4000`

### 2. Frontend Setup

```bash
cd bus-booking-frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎨 Branding

**RideWay** uses a unique color scheme and design:
- Primary: Deep ocean blue (#1a4d7a)
- Secondary: Vibrant orange (#ff6b35)
- Clean, modern interface inspired by Sri Lankan bus booking platforms

## 📊 Database Schema

### Users
- id, name, email, passwordHash, role

### Buses
- id, name, numberPlate, totalSeats

### Trips
- id, origin, destination, departureTime, arrivalTime, price, busId

### Bookings
- id, seats, status, userId, tripId

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MySQL + Sequelize ORM
- JWT auth, role-based access control
- Email delivery via Resend HTTP API
- CORS, dotenv

### Frontend
- React 18 + TypeScript
- Vite 7
- Material-UI (MUI)
- React Router with protected and admin routes
- Axios

## 📦 Deployment

### Backend
- Railway, Render, Heroku, AWS Elastic Beanstalk
- Use cloud MySQL (AWS RDS, Azure Database)

### Frontend
- Vercel (recommended)
- Netlify
- AWS Amplify
- Azure Static Web Apps

Don't forget to:
1. Set production environment variables
2. Update CORS origins in backend
3. Point frontend `VITE_API_URL` to production API

## 📝 API Endpoints

### Trips
- `GET /api/trips` - List all trips
- `POST /api/trips` - Create trip (admin)

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking

## 🔐 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bus_booking
DB_USER=root
DB_PASSWORD=your_password
PORT=4000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000/api
```

## 📄 License

MIT

## 👤 Author

Built for the Sri Lankan market with modern web technologies.

# Event Management System

Simple beginner-level college project using React + Vite, Node.js + Express, Mongoose, JWT, and local MongoDB Community Server.

## Requirements
- Node.js
- MongoDB Community Server running locally

## Setup

### Backend
```bash
cd backend
npm install
npm start
```

A `.env` file is optional. The backend has safe defaults, but you can copy `.env.example` to `.env`.

Default values:
```env
MONGO_URI=mongodb://127.0.0.1:27017/event_management
PORT=5000
JWT_SECRET=college-project-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Backend URL:
`http://localhost:5000`

### Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Admin login
```text
Email: admin@example.com
Password: admin123
```

The backend makes sure the admin password matches the configured admin password whenever it starts.

## MongoDB
The application uses only local MongoDB. Database name:
`event_management`

Collections:
- users
- events
- registrations


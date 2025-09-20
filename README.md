# 🛡️ Auth Service – H5P Interactive Lesson Platform

This is the authentication service for the H5P interactive lesson platform. It handles user login, role-based access control, and strong password validation for admins and teachers.

## 📁 Project Structure

The project is organized into two main directories:

```
auth-service/
├── backend/           # Backend Express server
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── app.js         # Express server
│   ├── init_h5p.js    # MongoDB seeder
│   └── .env           # Backend environment variables
├── frontend/          # Next.js frontend application
│   └── .env           # Frontend environment variables
└── package.json       # Root package.json for running both services
```

## 🚀 Getting Started

### Installation

1. Install dependencies for both backend and frontend:

```
npm run install:all
```

### Running the Application

To run both backend and frontend in development mode:

```
npm run dev
```

This will start:
- Backend server on http://localhost:4000
- Frontend application on http://localhost:3000

### Testing Login

You can test login using the frontend at http://localhost:3000

| Role    | Email           | Password          |
|---------|-----------------|-------------------|
| Admin   | admin@h5p.com   | StrongP@ssw0rd123 |
| Teacher | teacher@h5p.com | StrongP@ssw0rd123 |

## 🔧 Individual Service Management

### Backend Only

```
npm run dev:backend
node app.js
```

### Frontend Only

```
npm run dev:frontend
```

## 🧪 Seeding Test Users

To add admin and teacher users with secure passwords:

```
cd backend
node init_h5p.js
```

This script will:
- Reset existing test users (admin@h5p.com, teacher@h5p.com)
- Insert users with strong passwords
- Create index structures in MongoDB
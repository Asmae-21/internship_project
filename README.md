# 🛡️ Auth Service – H5P Interactive Lesson Platform

This is the **authentication service** for the H5P interactive lesson platform. It handles user login, role-based access control, and strong password validation for admins and teachers.

---

## 📦 Features

- 🔐 **User Authentication** via JWT
- 👨‍🏫 **Role-Based Access** (`admin`, `teacher`)
- ✅ **Password Strength Enforcement**
- 🧾 **MongoDB Atlas Integration**
- 📁 Modular Backend Setup (Users, Logs, Lessons, etc.)

---

## 📁 Folder Structure

auth-service/
├── models/
│ └── User.js
├── routes/
│ └── auth.js
├── middleware/
│ └── auth.js
├── init_h5p.js # MongoDB seeder
├── app.js # Express server
├── .env
├── package.json
└── README.md

yaml
Copier
Modifier

---

## 🔧 Environment Setup

Create a `.env` file with the following:

```env
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@<cluster-url>/auth_db?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=superSecretKey123
🧪 Seeding Test Users
To add admin and teacher users with a secure password (StrongP@ssw0rd123):

bash
Copier
Modifier
node init_h5p.js
This script will:

Reset existing test users (admin@h5p.com, teacher@h5p.com)

Insert users with strong passwords

Create index structures in MongoDB

🚀 Running the Server
To start the backend:

bash
Copier
Modifier
node app.js
Or if you have a script defined in package.json:

bash
Copier
Modifier
npm start
You should see:

arduino
Copier
Modifier
MongoDB connected ✅
Server is running on port 4000
🧑‍💻 Login Credentials for Testing
You can test login using:

Role	Email	Password
Admin	admin@h5p.com	StrongP@ssw0rd123
Teacher	teacher@h5p.com	StrongP@ssw0rd123

Only strong passwords matching the required regex are accepted.

🔐 Password Requirements
All user passwords must match the following criteria:

Minimum 8 characters

At least one uppercase letter

At least one lowercase letter

At least one digit

At least one special character

js
Copier
Modifier
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
✅ Tasks Achieved
 User Authentication (JWT)

 Admin & Teacher Roles

 Strong Password Enforcement

 Access Control Middleware

 Test Users Created via Seeder

 MongoDB Atlas Setup

📬 Login Endpoint
http
Copier
Modifier
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@h5p.com",
  "password": "StrongP@ssw0rd123"
}
Returns:

json
Copier
Modifier
{
  "token": "<JWT Token>",
  "role": "admin"
}

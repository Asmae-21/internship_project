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



node app.js
Or if you have a script defined in package.json:


npm run dev
You should see:

arduino

MongoDB connected ✅
Server is running on port 4000
🧑‍💻 Login Credentials for Testing
You can test login using:
 http://localhost:3001
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

# Auth Service Backend

This is the backend for the Auth Service application, providing API endpoints for user management and authentication.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/auth-service
   JWT_SECRET=your_jwt_secret_key
   ```

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Testing User Creation Flow

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Navigate to the admin dashboard at `http://localhost:3000/Admin/admin-dashboard`

4. Click on the "Add New User" button

5. Fill out the user creation form with the following test data:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Phone: +1234567890
   - Classes: Test Class
   - Subjects: Test Subject
   - Password: Test@123
   - Confirm Password: Test@123
   - Upload a test photo (optional)

6. Click "Save" to create the user

7. You should be redirected to the users list page where the newly created user should appear

## Troubleshooting

- If you encounter CORS issues, make sure the frontend URL is correctly set in the CORS configuration in `app.js`
- If file uploads are not working, ensure the uploads directory exists and has proper permissions
- For database connection issues, verify your MongoDB connection string in the `.env` file
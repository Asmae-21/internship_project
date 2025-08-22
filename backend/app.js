const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ Add this line

dotenv.config();
const app = express();

// ✅ Enable CORS before any routes
app.use(cors({
  origin: 'http://localhost:3000', // allow frontend
  credentials: true
}));

app.use(express.json());

// Add auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB error ❌', err));

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from the server 🎉');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

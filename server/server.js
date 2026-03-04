const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookstor';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Middleware to check DB connection
const checkDB = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Database disconnected' });
    }
    next();
};

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingRoutes = require('./routes/settingRoutes');

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes); // Admin auth
app.use('/api/users', userRoutes); // User auth
app.use('/api/orders', orderRoutes); // Orders
app.use('/api/analytics', analyticsRoutes); // Business Analytics
app.use('/api/settings', settingRoutes); // Global settings

app.get('/', (req, res) => {
    res.send('LuminaBooks API is running (latest version)');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

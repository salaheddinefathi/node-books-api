const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
}

// Middleware
const allowedOrigins = [
    'https://node-books-api-ekwm.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman, mobile apps)
        if (!origin) return callback(null, true);
        // Allow any Vercel preview/branch deployment for this project
        if (
            allowedOrigins.includes(origin) ||
            /^https:\/\/node-books-api-ekwm[a-z0-9-]*\.vercel\.app$/.test(origin)
        ) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstor';

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
app.use('/api/books', checkDB, bookRoutes);
app.use('/api/auth', checkDB, authRoutes); // Admin auth
app.use('/api/users', checkDB, userRoutes); // User auth
app.use('/api/orders', checkDB, orderRoutes); // Orders
app.use('/api/analytics', checkDB, analyticsRoutes); // Business Analytics
app.use('/api/settings', checkDB, settingRoutes); // Global settings

app.get('/', (req, res) => {
    res.send('LuminaBooks API is running (CORS FIX V2)');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Deployment Environment: ${process.env.NODE_ENV || 'production'}`);
});

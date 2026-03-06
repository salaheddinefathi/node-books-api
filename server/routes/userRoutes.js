const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate User ID
const generateUserId = () => {
    return 'USR-' + Math.floor(1000 + Math.random() * 9000);
};

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required (name, email, phone, password)' });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists with this email' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            userId: generateUserId(),
            name,
            email,
            phone,
            password: hashedPassword
        });

        console.log('Registering user:', email);
        await user.save();

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error (JWT)' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || 'user'
            }
        });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({
            message: 'Server error during registration',
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error (JWT)' });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;

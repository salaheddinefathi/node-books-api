const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`Login attempt for ${username}`);

        // Find Admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log('Admin not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Token
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ valid: false });

        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/settings
// @desc    Get all global settings
router.get('/', async (req, res) => {
    try {
        const settings = await Setting.find();
        // Convert to a simple object { key: value }
        const settingsObj = settings.reduce((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
        res.json(settingsObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/settings
// @desc    Update or create settings
router.put('/', auth, async (req, res) => {
    const updates = req.body; // Expecting { key: value }
    try {
        const promises = Object.entries(updates).map(([key, value]) => {
            return Setting.findOneAndUpdate(
                { key },
                { value },
                { upsert: true, new: true }
            );
        });
        await Promise.all(promises);
        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

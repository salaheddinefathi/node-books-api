const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');

// Helper: generate order number
const generateOrderNumber = () => {
    return 'ORD-' + Math.floor(1000 + Math.random() * 9000);
};

// @route   POST /api/orders
// @desc    Create a new order (logged-in user)
router.post('/', auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { items, subtotal, tax, total } = req.body;

        if (!items || items.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'No items in order' });
        }

        // Fetch user info (phone, name, email)
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate and update stock for each book
        const outOfStockItems = [];

        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.book)) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Invalid book ID: ${item.book}` });
            }

            const book = await Book.findById(item.book).session(session);
            if (!book) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: `Book not found: ${item.title}`,
                    missingBookId: item.book
                });
            }

            if (book.stock < item.quantity) {
                outOfStockItems.push({
                    id: book._id,
                    title: book.title,
                    cover: book.cover,
                    available: book.stock,
                    requested: item.quantity
                });
            }
        }

        if (outOfStockItems.length > 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Certains articles ne sont plus disponibles en stock suffisant.",
                outOfStock: true,
                items: outOfStockItems
            });
        }

        // Decrement stock for all items now that we know they are all available
        for (const item of items) {
            await Book.findByIdAndUpdate(item.book, {
                $inc: { stock: -item.quantity }
            }, { session });
        }

        const order = new Order({
            orderNumber: generateOrderNumber(),
            user: req.user.id,
            customerName: user.name,
            customerPhone: user.phone,
            customerEmail: user.email,
            items: items,
            subtotal: subtotal,
            shipping: req.body.shipping || 0,
            tax: 0,
            total: subtotal + (req.body.shipping || 0),
            whatsappSent: true
        });

        const savedOrder = await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedOrder);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error('Create Order Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/orders
// @desc    Get ALL orders (admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/orders/my
// @desc    Get orders for the logged-in user
router.get('/my', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin only) — restores stock on cancellation
router.put('/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Restore stock if cancelling and order was not already cancelled
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.items) {
                await Book.findByIdAndUpdate(item.book, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

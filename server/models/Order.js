const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    items: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
            title: { type: String, required: true },
            cover: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    whatsappSent: { type: Boolean, default: false },
    notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    cover: { type: String, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

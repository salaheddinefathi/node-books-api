const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// @route   GET /api/books
// @desc    Get all books (with optional category filter)
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/books/:id
// @desc    Get a single book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/books
// @desc    Add a new book with cover upload
router.post('/', auth, upload.single('cover'), async (req, res) => {
    const { title, author, price, category, stock, description } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : '';

    const book = new Book({
        title,
        author,
        price,
        category,
        stock,
        cover,
        description
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/books/:id
router.delete('/:id', auth, async (req, res) => {
    console.log('Backend: DELETE request for book ID:', req.params.id);
    try {
        // Find the book first to get the cover image path
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found in DB');
            return res.status(404).json({ message: 'Book not found' });
        }

        // PHYSICAL FILE DELETION
        if (book.cover && !book.cover.startsWith('http')) {
            const filePath = path.join(__dirname, '..', book.cover);
            console.log('Attempting to delete image file:', filePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log('Image file deleted successfully');
            } else {
                console.warn('Image file not found on server:', filePath);
            }
        }

        // DATABASE DELETION
        await Book.findByIdAndDelete(req.params.id);

        console.log('Book record deleted from DB successfully');
        res.json({ message: 'Book and cover image deleted successfully' });
    } catch (err) {
        console.error('Delete Error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/books/:id
// @desc    Update book details
router.put('/:id', auth, async (req, res) => {
    const { title, author, price, category, stock, description } = req.body;
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (title !== undefined) book.title = title;
        if (author !== undefined) book.author = author;
        if (price !== undefined) book.price = price;
        if (category !== undefined) book.category = category;
        if (stock !== undefined) book.stock = stock;
        if (description !== undefined) book.description = description;

        await book.save();
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');
const imagekit = require('../config/imagekit');

// Multer Storage Configuration - Using Memory Storage for ImageKit
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
// @desc    Add a new book with cover upload via ImageKit
router.post('/', auth, upload.single('cover'), async (req, res) => {
    try {
        const { title, author, price, category, stock, description } = req.body;
        let cover = '';
        let coverId = '';

        if (req.file) {
            // Upload to ImageKit
            const ikResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: `book_${Date.now()}_${req.file.originalname}`,
                folder: '/books'
            });
            cover = ikResponse.url;
            coverId = ikResponse.fileId;
        }

        const book = new Book({
            title,
            author,
            price,
            category,
            stock,
            cover,
            coverId,
            description
        });

        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/books/:id
router.delete('/:id', auth, async (req, res) => {
    console.log('Backend: DELETE request for book ID:', req.params.id);
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found in DB');
            return res.status(404).json({ message: 'Book not found' });
        }

        // PHYSICAL FILE DELETION (IMAGEKIT)
        if (book.coverId) {
            console.log('Attempting to delete image from ImageKit:', book.coverId);
            try {
                await imagekit.deleteFile(book.coverId);
                console.log('Image deleted from ImageKit successfully');
            } catch (ikErr) {
                console.error('ImageKit Deletion Error:', ikErr.message);
                // We continue even if image deletion fails, to ensure DB record is removed
            }
        } else if (book.cover && !book.cover.startsWith('http')) {
            // FALLBACK for old local files
            const filePath = path.join(__dirname, '..', book.cover);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
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

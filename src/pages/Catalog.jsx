import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import './Catalog.css';

const Catalog = () => {
    const { addToCart } = useCart();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'rating'

    const handleQuickAdd = (e, book) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(book, 1);
        toast.success(`"${book.title}" added to cart!`, {
            style: {
                borderRadius: '12px',
                background: '#1c1917',
                color: '#fff',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: '600'
            },
            iconTheme: {
                primary: '#4f46e5',
                secondary: '#fff',
            }
        });
    };

    const categories = [
        'All', 'Fiction', 'Non-Fiction', 'Fantasy', 'Mystery', 'Sci-Fi',
        'Self-Help', 'Biography', 'History', 'Programming', 'Technology',
        'Psychology', 'Business', 'Romance', 'Horror', 'Manga'
    ];

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        filterBooks();
    }, [searchTerm, selectedCategory, sortBy, books]);

    const fetchBooks = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/books`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch books');
            setBooks(data);
            setLoading(false);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const filterBooks = () => {
        let result = [...books];

        if (selectedCategory !== 'All') {
            result = result.filter(book => book.category === selectedCategory);
        }

        if (searchTerm) {
            result = result.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        setFilteredBooks(result);
    };

    return (
        <div className="catalog-page">
            <header className="catalog-header">
                <div className="container">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Explore Our <span>Collection</span>
                    </motion.h1>
                    <p>Discover thousands of books across all genres</p>
                </div>
            </header>

            <div className="container catalog-layout">
                {/* Search and Filter Bar */}
                <div className="discovery-bar">
                    <div className="discovery-top">
                        <div className="search-box">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="sort-dropdown">
                            <SlidersHorizontal size={18} />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                    <div className="category-scroll">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="catalog-results-info">
                    Showing {filteredBooks.length} books {selectedCategory !== 'All' && `in ${selectedCategory}`}
                </div>

                {loading ? (
                    <div className="loading-state">Loading your next story...</div>
                ) : error ? (
                    <div className="error-state">⚠️ {error}</div>
                ) : (
                    <div className="books-grid">
                        <AnimatePresence mode='popLayout'>
                            {filteredBooks.map((book, index) => (
                                <motion.div
                                    layout
                                    key={book._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="book-card"
                                >
                                    <Link to={`/book/${book._id}`}>
                                        <div className="book-cover">
                                            <img
                                                src={book.cover.startsWith('http') ? book.cover : `${API_BASE_URL}${book.cover}`}
                                                alt={book.title}
                                                style={{ opacity: book.stock <= 0 ? 0.5 : 1 }}
                                            />
                                            <div className="card-overlay" onClick={(e) => book.stock > 0 && handleQuickAdd(e, book)}>
                                                <button
                                                    className="add-to-cart"
                                                    disabled={book.stock <= 0}
                                                    style={{
                                                        cursor: book.stock <= 0 ? 'not-allowed' : 'pointer',
                                                        opacity: book.stock <= 0 ? 0.5 : 1
                                                    }}
                                                >
                                                    {book.stock > 0 ? (
                                                        <><ShoppingCart size={18} /> Add to Cart</>
                                                    ) : (
                                                        'Out of Stock'
                                                    )}
                                                </button>
                                            </div>
                                            <div className="category-tag">{book.category}</div>
                                            {book.stock <= 0 && (
                                                <div className="out-of-stock-badge">OUT OF STOCK</div>
                                            )}
                                        </div>
                                        <div className="book-info">
                                            <h3>{book.title}</h3>
                                            <p className="author">{book.author}</p>
                                            <div className="book-footer">
                                                <span className="price">${book.price}</span>
                                                <div className="rating">
                                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                                    <span>{book.rating || 4.5}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredBooks.length === 0 && (
                    <div className="no-results">
                        <h3>No books found matching your search.</h3>
                        <p>Try different keywords or category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;

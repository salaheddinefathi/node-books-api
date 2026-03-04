import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ArrowUpRight, ShoppingCart, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './Home.css';

const Home = () => {
    const { addToCart } = useCart();
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetch('http://localhost:5000/api/books')
            .then(res => {
                if (!res.ok) throw new Error('API Unavailable');
                return res.json();
            })
            .then(data => setBooks(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error('Error fetching books:', err);
                setError(true);
            });
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-container">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="hero-content"
                    >
                        <div className="hero-badge-container">
                            <span className="hero-badge">NEW ARRIVALS 2026</span>
                            <span className="hero-badge-dot"></span>
                            <span className="hero-badge-text">500+ NEW TITLES</span>
                        </div>

                        <h1>Read Something <span>Extraordinary</span> Today</h1>

                        <p className="hero-description">
                            Step into a world of curated literature where every page tells a story worth remembering. From hidden gems to global bestsellers.
                        </p>

                        <div className="hero-btns">
                            <Link to="/catalog" className="btn btn-primary btn-lg">
                                Explore Catalog <ArrowRight size={20} />
                            </Link>
                            <button className="btn btn-glass btn-lg">
                                <Star size={18} fill="currentColor" /> Best Sellers
                            </button>
                        </div>

                        <div className="hero-trust">
                            <div className="trust-avatars">
                                <img src="https://i.pravatar.cc/100?u=1" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=2" alt="User" />
                                <img src="https://i.pravatar.cc/100?u=3" alt="User" />
                                <div className="avatar-plus">+12k</div>
                            </div>
                            <div className="trust-text">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                                </div>
                                <p>Trusted by 12,000+ readers worldwide</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="hero-visual"
                    >
                        <div className="hero-image-wrapper">
                            <img
                                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
                                alt="Books Collection"
                                className="main-hero-img"
                            />
                            <div className="floating-card card-1">
                                <div className="icon-box"><BookOpen size={20} /></div>
                                <div>
                                    <h4>Premium Quality</h4>
                                    <p>Hardcover Editions</p>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="icon-box"><Star size={20} fill="#f59e0b" color="#f59e0b" /></div>
                                <div>
                                    <h4>Top Rated</h4>
                                    <p>4.9/5 Avg. Rating</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="featured container">
                <div className="section-header">
                    <div>
                        <span className="badge">Curated Collections</span>
                        <h2>Bestselling This Month</h2>
                    </div>
                    <Link to="/catalog" className="view-all">
                        Explore All <ArrowUpRight size={20} />
                    </Link>
                </div>

                <div className="books-grid">
                    {books.map((book, index) => (
                        <motion.div
                            key={book._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="book-card"
                        >
                            <Link to={`/book/${book._id}`}>
                                <div className="book-cover">
                                    <img
                                        src={book.cover.startsWith('http') ? book.cover : `http://localhost:5000${book.cover}`}
                                        alt={book.title}
                                    />
                                    <div className="card-overlay" onClick={(e) => handleQuickAdd(e, book)}>
                                        <button className="add-to-cart">
                                            <ShoppingCart size={18} /> Add to Cart
                                        </button>
                                    </div>
                                    <div className="category-tag">{book.category}</div>
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
                </div>
            </section>
        </div>
    );
};

export default Home;

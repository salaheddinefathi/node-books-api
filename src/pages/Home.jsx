import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Star, ArrowUpRight, ShoppingCart, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import './Home.css';
import Services from '../components/Services';
import heroImg from '../assets/hero.png';
import Loading from '../components/Loading';

const Home = () => {
    const location = useLocation();
    const { addToCart } = useCart();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to chunk books into rows
    const chunkBooks = (arr, size) => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );
    };

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
        console.log("🔗 Calling API:", `${API_BASE_URL}/api/books`);
        fetch(`${API_BASE_URL}/api/books`)
            .then(res => {
                if (!res.ok) throw new Error(`API Error: ${res.status}`);
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("❌ Server returned HTML instead of JSON. Check your API_BASE_URL.");
                }
                return res.json();
            })
            .then(data => {
                setBooks(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching books:', err.message);
                setError(true);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) return <Loading fullPage />;

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

                        <motion.h1
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            initial="hidden"
                            animate="visible"
                            className="typewriter-headline"
                        >
                            {"Read Something ".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, display: "none" },
                                        visible: { opacity: 1, display: "inline" }
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            <span className="extrawriter">
                                {"Extraordinary".split("").map((char, index) => (
                                    <motion.span
                                        key={index}
                                        className="extraordinary-text"
                                        variants={{
                                            hidden: { opacity: 0, display: "none" },
                                            visible: { opacity: 1, display: "inline" }
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                            {" Today".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, display: "none" },
                                        visible: { opacity: 1, display: "inline" }
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            <motion.span
                                className="typing-cursor"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                            >
                                |
                            </motion.span>
                        </motion.h1>

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
                                src={heroImg}
                                alt="Young man reading a book in library"
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

                <div className="books-rows">
                    {chunkBooks(books, 10).map((rowBooks, rowIndex) => (
                        <BookRow
                            key={rowIndex}
                            books={rowBooks}
                            handleQuickAdd={handleQuickAdd}
                            API_BASE_URL={API_BASE_URL}
                            location={location}
                        />
                    ))}
                </div>
            </section>

            <Services />
        </div>
    );
};

// Independent Row Component
const BookRow = ({ books, handleQuickAdd, API_BASE_URL, location }) => {
    const rowRef = React.useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="book-row-wrapper">
            <button className="row-nav-btn prev pc-only" onClick={() => scroll('left')}>
                <ChevronLeft size={24} />
            </button>
            <div className="books-grid" ref={rowRef}>
                {books.map((book, index) => (
                    <motion.div
                        key={book._id || index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="book-card"
                    >
                        <Link to={`/book/${book._id}`} state={{ backgroundLocation: location }}>
                            <div className="book-cover">
                                <img
                                    src={book.cover.startsWith('http') ? book.cover : `${API_BASE_URL}${book.cover}`}
                                    alt={book.title}
                                />
                                <div className="card-overlay">
                                    <button className="add-to-cart">
                                        <BookOpen size={18} /> View Details
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
            <button className="row-nav-btn next pc-only" onClick={() => scroll('right')}>
                <ChevronRight size={24} />
            </button>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import './BookDetails.css';
import Loading from '../components/Loading';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    const isModal = !!location.state?.backgroundLocation;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/books/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Book not found');
                setBook(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isModal) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isModal]);

    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        if (quantity < (book.stock || 10)) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(book, quantity);
        toast.success(`${quantity} x "${book.title}" added to cart!`, {
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

    if (loading) return <Loading fullPage />;
    if (error) return <div className="details-error">⚠️ {error}</div>;

    return (
        <motion.div
            className={`book-details-overlay ${!isModal ? 'full-page' : ''}`}
            initial={isModal ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {isModal && <div className="details-backdrop" onClick={() => navigate(-1)}></div>}
            <motion.div
                className={`book-details-page ${!isModal ? 'full-page' : ''}`}
                initial={isModal ? { y: "100%" } : { y: 0 }}
                animate={{ y: isModal ? "2%" : 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 150 }}
            >
                <div className="sheet-handle"></div>
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <ArrowLeft size={20} /> Back to Catalog
                    </button>

                    <div className="details-layout">
                        {/* Left: Book Cover */}
                        <div className="details-image">
                            <img
                                src={book.cover.startsWith('http') ? book.cover : `${API_BASE_URL}${book.cover}`}
                                alt={book.title}
                            />
                            <div className="details-badge">{book.category}</div>
                        </div>

                        {/* Right: Book Info */}
                        <div className="details-info">
                            <nav className="breadcrumb">
                                <Link to="/catalog">Books</Link> / <span>{book.category}</span>
                            </nav>

                            <h1>{book.title}</h1>
                            <p className="details-author">By <span>{book.author}</span></p>

                            <div className="details-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < 4 ? "#f59e0b" : "none"} color="#f59e0b" />
                                    ))}
                                </div>
                                <span>4.5 (120+ Reviews)</span>
                            </div>

                            <div className="details-price">
                                ${(book.price * quantity).toFixed(2)}
                            </div>

                            <div className="details-description">
                                <h3>Description</h3>
                                <p>{book.description || "No description available for this masterpiece yet."}</p>
                            </div>

                            <div className="inventory-status">
                                {book.stock > 0 ? (
                                    <span className="in-stock">● In Stock ({book.stock} available)</span>
                                ) : (
                                    <span className="out-of-stock">● Out of Stock</span>
                                )}
                            </div>

                            <div className="details-actions">
                                {book.stock > 0 ? (
                                    <div className="quantity-selector">
                                        <button
                                            className={`quantity-btn ${quantity <= 1 ? 'disabled' : ''}`}
                                            onClick={handleDecrement}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{quantity}</span>
                                        <button
                                            className={`quantity-btn ${quantity >= book.stock ? 'disabled' : ''}`}
                                            onClick={handleIncrement}
                                            disabled={quantity >= book.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : null}
                                <button
                                    className={`add-to-cart-btn ${book.stock <= 0 ? 'out-of-stock' : ''}`}
                                    onClick={handleAddToCart}
                                    disabled={book.stock <= 0}
                                >
                                    {book.stock > 0 ? (
                                        <><ShoppingCart size={20} /> Add to Cart</>
                                    ) : (
                                        'Currently Out of Stock'
                                    )}
                                </button>
                            </div>

                            <div className="trust-badges">
                                <div className="trust-item">
                                    <Truck size={20} />
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="trust-item">
                                    <ShieldCheck size={20} />
                                    <span>Secure Payment</span>
                                </div>
                                <div className="trust-item">
                                    <RefreshCw size={20} />
                                    <span>Free Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BookDetails;

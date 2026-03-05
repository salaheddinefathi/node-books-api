import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import './BookDetails.css';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
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

    if (loading) return <div className="details-loading">Searching the library...</div>;
    if (error) return <div className="details-error">⚠️ {error}</div>;

    return (
        <div className="book-details-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back to Catalog
                </button>

                <div className="details-layout">
                    {/* Left: Book Cover */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="details-image"
                    >
                        <img
                            src={book.cover.startsWith('http') ? book.cover : `${API_BASE_URL}${book.cover}`}
                            alt={book.title}
                        />
                        <div className="details-badge">{book.category}</div>
                    </motion.div>

                    {/* Right: Book Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="details-info"
                    >
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
                                        onClick={handleDecrement}
                                        disabled={quantity <= 1}
                                        style={{ opacity: quantity <= 1 ? 0.3 : 1, cursor: quantity <= 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={handleIncrement}
                                        disabled={quantity >= book.stock}
                                        style={{ opacity: quantity >= book.stock ? 0.3 : 1, cursor: quantity >= book.stock ? 'not-allowed' : 'pointer' }}
                                    >
                                        +
                                    </button>
                                </div>
                            ) : null}
                            <button
                                className="add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={book.stock <= 0}
                                style={{
                                    backgroundColor: book.stock <= 0 ? '#444' : 'var(--primary)',
                                    cursor: book.stock <= 0 ? 'not-allowed' : 'pointer',
                                    opacity: book.stock <= 0 ? 0.7 : 1
                                }}
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
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { AlertCircle, Terminal, Info } from 'lucide-react';
import API_BASE_URL from '../config/api';
import './Cart.css';

const CustomStockError = ({ items, backendUrl, toastId }) => (
    <div className="stock-error-toast">
        <div className="stock-error-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} />
                <span>Stock Insuffisant</span>
            </div>
            <button
                onClick={() => toast.dismiss(toastId)}
                className="stock-close-btn"
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', transition: '0.2s', padding: '4px', borderRadius: '50%' }}
            >
                <X size={18} />
            </button>
        </div>
        <div className="stock-error-list">
            {items.map((item, idx) => (
                <div key={idx} className="stock-error-item">
                    <img
                        src={item.cover.startsWith('http') ? item.cover : `${backendUrl}${item.cover}`}
                        alt={item.title}
                        className="stock-error-img"
                    />
                    <div className="stock-error-info">
                        <h4>{item.title}</h4>
                        <p className="stock-error-msg">
                            Disponible: <span>{Math.max(0, item.available)}</span> | Demandé: <span>{item.requested}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Cart = () => {
    const location = useLocation();
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [settings, setSettings] = useState({ shippingCost: 0 });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const navigate = useNavigate();

    const WHATSAPP_NUMBER = "212777725652";

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };


    const handleCheckout = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const cartTotal = getCartTotal();
        const shipping = parseFloat(settings.shippingCost) || 0;
        const finalTotal = parseFloat((cartTotal + shipping).toFixed(2));

        // Build WhatsApp message (always ready as fallback)
        const buildWhatsAppMessage = (orderNumber = 'N/A') => {
            const appUrl = "https://node-books-api-ekwm.vercel.app";
            const message = [
                `📚 *LuminaBooks | New Order Confirmed*`,
                `Hello *${user.name}*, thank you for shopping with us! Your order has been received and is being processed.`,
                ``,
                `👤 *Customer Details:*`,
                ``,
                `Name: ${user.name}`,
                `Customer ID: ${user.userId?.slice(-6).toUpperCase() || 'N/A'}`,
                `Phone: ${user.phone}`,
                ``,
                `📦 *Items Ordered:*`,
                ``,
                ...cart.map((item) => {
                    const bookUrl = `${appUrl}/book/${item._id}`;
                    return `Book: *${item.title}*\nQuantity: ${item.quantity}\nPrice: $${(item.price * item.quantity).toFixed(2)}\nView Details: ${bookUrl}\n`;
                }),
                `💰 *Order Summary:*`,
                ``,
                `Subtotal: $${cartTotal.toFixed(2)}`,
                shipping > 0 ? `Shipping: $${shipping.toFixed(2)}` : `Shipping: FREE 🚚`,
                ``,
                `*TOTAL PAYABLE: $${finalTotal.toFixed(2)} ✅*`,
                ``,
                `📍 Our team will contact you shortly to confirm the delivery schedule.`,
                ``,
                `Thank you for choosing *LuminaBooks*!`
            ].join('\n');

            return encodeURIComponent(message);
        };

        // Build items payload for DB
        const itemsPayload = cart.map(item => ({
            book: item._id,
            title: item.title,
            cover: item.cover,
            price: parseFloat(item.price),
            quantity: item.quantity
        }));

        try {
            // Save order to backend
            const token = localStorage.getItem('lumina_auth_token');
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: itemsPayload,
                    subtotal: parseFloat(cartTotal.toFixed(2)),
                    shipping: parseFloat(settings.shippingCost) || 0,
                    total: finalTotal
                })
            });

            const data = await res.json();

            if (!res.ok) {
                console.error('Order save failed:', data);

                if (res.status === 400 && data.outOfStock) {
                    toast.custom((t) => (
                        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} custom-stock-toast shake-animation`}>
                            <style>{`
                                .custom-stock-toast {
                                    background: rgba(15, 23, 42, 0.95);
                                    backdrop-filter: blur(16px);
                                    border: 1px solid rgba(239, 68, 68, 0.4);
                                    border-radius: 24px;
                                    padding: 1.5rem;
                                    color: white;
                                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                                    max-width: 420px;
                                    width: 100%;
                                }
                                .stock-error-toast { display: flex; flex-direction: column; gap: 1rem; }
                                .stock-error-header { display: flex; align-items: center; justify-content: space-between; color: #ef4444; font-weight: 800; font-size: 1.1rem; border-bottom: 1px solid rgba(239, 68, 68, 0.2); padding-bottom: 0.75rem; }
                                .stock-error-list { display: flex; flex-direction: column; gap: 0.75rem; }
                                .stock-error-item { display: flex; gap: 1rem; align-items: center; background: rgba(255, 255, 255, 0.03); padding: 0.5rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); }
                                .stock-error-img { width: 48px; height: 64px; object-fit: cover; border-radius: 6px; }
                                .stock-error-info h4 { font-size: 0.9rem; font-weight: 700; margin: 0; }
                                .stock-error-msg { font-size: 0.75rem; color: #94a3b8; margin: 0.2rem 0 0; }
                                .stock-error-msg span { color: #ef4444; font-weight: 700; }
                                
                                .shake-animation {
                                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                                }

                                .animate-enter { animation: enter 0.3s ease-out forwards; }
                                .animate-leave { animation: leave 0.2s ease-in forwards; }
                                
                                @keyframes enter { from { opacity: 0; transform: translateY(-20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                                @keyframes leave { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(10px) scale(0.95); } }

                                @keyframes shake {
                                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                                    20%, 80% { transform: translate3d(2px, 0, 0); }
                                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                                    40%, 60% { transform: translate3d(4px, 0, 0); }
                                }
                            `}</style>
                            <CustomStockError items={data.items} backendUrl={API_BASE_URL} toastId={t.id} />
                        </div>
                    ), {
                        id: 'stock-error',
                        duration: 6000,
                        position: 'top-center',
                    });
                    return;
                }

                if (res.status === 404 && data.missingBookId) {
                    toast.error(`❌ "${data.message.split(': ')[1]}" is no longer available. Automatically removing from cart.`);
                    removeFromCart(data.missingBookId);
                    return;
                }

                if (res.status === 404 && data.message && data.message.includes('Book not found')) {
                    toast.error(`❌ ${data.message}. Please remove it from your cart.`);
                    return;
                }

                // Generic error - still open WhatsApp as fallback but warn user
                toast.error("Erreur système. Passage à la commande WhatsApp...");
                clearCart();
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, '_blank');
                return;
            }

            // Success — open WhatsApp with order number
            clearCart();
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(data.orderNumber)}`, '_blank');

        } catch (err) {
            console.error('Checkout network error:', err.message);
            // Backend unreachable — still proceed with WhatsApp
            clearCart();
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, '_blank');
        }
    };


    if (cart.length === 0) {
        return (
            <div className="cart-empty-state">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="empty-box"
                    >
                        <ShoppingBag size={80} className="empty-icon" />
                        <h2>Your library is empty</h2>
                        <p>Your shopping cart is waiting for some new stories. Explore our collection and find your next favorite book.</p>
                        <Link to="/catalog" className="explore-btn">
                            Explore Catalog <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="cart-title"
                >
                    Your Shopping <span>Cart</span>
                </motion.h1>

                <div className="cart-content">
                    {/* Items List */}
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={item._id}
                                className="cart-item"
                            >
                                <div className="item-image">
                                    <img
                                        src={item.cover.startsWith('http') ? item.cover : `${API_BASE_URL}${item.cover}`}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="item-details">
                                    <div className="item-main">
                                        <Link to={`/book/${item._id}`} state={{ backgroundLocation: location }}>
                                            <h3>{item.title}</h3>
                                        </Link>
                                        <p className="item-author">By {item.author}</p>
                                        <p className="item-price-unit">${item.price}</p>
                                    </div>
                                    <div className="item-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary / Invoice */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="cart-summary"
                    >
                        <h3>Order Invoice</h3>
                        <div className="summary-row">
                            <span>Items ({cart.length})</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping Costs</span>
                            {parseFloat(settings.shippingCost) > 0 ? (
                                <span>${parseFloat(settings.shippingCost).toFixed(2)}</span>
                            ) : (
                                <span className="free">Calculated • FREE</span>
                            )}
                        </div>

                        <div className="summary-divider"></div>

                        <div className="total-row">
                            <span>Total Payable</span>
                            <span>${(getCartTotal() + (parseFloat(settings.shippingCost) || 0)).toFixed(2)}</span>
                        </div>

                        <button className="checkout-btn" onClick={handleCheckout}>
                            Complete Order <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Login Required Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '1rem'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                padding: '2.5rem',
                                borderRadius: '24px',
                                maxWidth: '500px',
                                width: '100%',
                                textAlign: 'center',
                                position: 'relative',
                                border: '1px solid var(--border)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <button
                                onClick={() => setShowLoginModal(false)}
                                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'var(--primary)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                margin: '0 auto 1.5rem',
                                color: 'white'
                            }}>
                                <ShoppingBag size={40} style={{ margin: '0 auto' }} />
                            </div>

                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>One last step!</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
                                To finalize your order, you need to be logged into your account. This helps us track your purchase and contact you via WhatsApp.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/login')}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem'
                                    }}
                                >
                                    <LogIn size={20} /> Login to Account
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/signup')}
                                    style={{
                                        padding: '1rem',
                                        backgroundColor: 'transparent',
                                        color: 'var(--text-main)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem'
                                    }}
                                >
                                    <UserPlus size={20} /> Create New Account
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;

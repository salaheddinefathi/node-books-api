import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import './MyOrders.css';

const statusColors = {
    pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b' },
    confirmed: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
    shipped: { bg: 'rgba(79,70,229,0.1)', text: '#4f46e5' },
    delivered: { bg: 'rgba(16,185,129,0.15)', text: '#059669' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const token = localStorage.getItem('lumina_auth_token');
                const res = await fetch(`${API_BASE_URL}/api/orders/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    if (loading) return <div className="orders-loading">Loading your orders...</div>;

    return (
        <div className="my-orders-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="orders-header"
                >
                    <h1>My <span>Orders</span></h1>
                    <p>Track and review your purchase history</p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="orders-empty"
                    >
                        <ShoppingBag size={64} className="empty-icon" />
                        <h2>No orders yet</h2>
                        <p>You haven't placed any orders yet. Explore our catalog and find your next favorite read!</p>
                        <Link to="/catalog" className="explore-catalog-btn">
                            Browse Catalog <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order, index) => {
                            const color = statusColors[order.status] || statusColors.pending;
                            const isExpanded = expandedId === order._id;
                            return (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.07 }}
                                    className="order-card"
                                >
                                    <div className="order-card-header" onClick={() => toggleExpand(order._id)}>
                                        <div className="order-meta">
                                            <span className="order-number">{order.orderNumber}</span>
                                            <span className="order-date">
                                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                                            </span>
                                        </div>
                                        <div className="order-right">
                                            <span
                                                className="order-status"
                                                style={{ backgroundColor: color.bg, color: color.text }}
                                            >
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <span className="order-total">${order.total.toFixed(2)}</span>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                key="details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="order-card-body"
                                            >
                                                <div className="order-items-list">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="order-item-row">
                                                            <img
                                                                src={item.cover?.startsWith('http') ? item.cover : `${API_BASE_URL}${item.cover}`}
                                                                alt={item.title}
                                                                className="order-item-cover"
                                                            />
                                                            <div className="order-item-info">
                                                                <p className="order-item-title">{item.title}</p>
                                                                <p className="order-item-qty">Qty: {item.quantity}</p>
                                                            </div>
                                                            <span className="order-item-price">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-summary-footer">
                                                    <div className="order-totals">
                                                        <span>Subtotal: <strong>${order.subtotal?.toFixed(2)}</strong></span>
                                                        <span>Tax: <strong>${order.tax?.toFixed(2)}</strong></span>
                                                        <span className="total-final">Total: <strong>${order.total?.toFixed(2)}</strong></span>
                                                    </div>
                                                    <a
                                                        href={`https://wa.me/212777725652`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="contact-btn"
                                                    >
                                                        <Phone size={16} /> Contact Support
                                                    </a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

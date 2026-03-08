import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Clock, Zap, BookOpen, ShieldCheck, ArrowRight, PhoneCall } from 'lucide-react';
import './Support.css';

const Support = () => {
    const WHATSAPP_NUMBER = "212777725652";
    const SUPPORT_EMAIL = "support@luminabooks.com";

    const handleWhatsApp = () => {
        const message = encodeURIComponent("Hello LuminaBooks Support, I have a question about...");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    const handleEmail = () => {
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=LuminaBooks Support Request`;
    };

    return (
        <div className="support-page">
            <div className="container">
                <div className="support-wrapper">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="support-header"
                    >

                        <h1>We're here for you <span>anytime</span> 🌙</h1>
                    </motion.div>

                    <div className="support-grid">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="support-benefits"
                        >
                            <h2>🚀 Why chat with us?</h2>

                            <div className="benefit-card">
                                <div className="benefit-icon zap">
                                    <Zap size={24} />
                                </div>
                                <div className="benefit-info">
                                    <h3>Quick Responses</h3>
                                    <p>Get answers right here on WhatsApp in minutes.</p>
                                </div>
                            </div>

                            <div className="benefit-card">
                                <div className="benefit-icon book">
                                    <BookOpen size={24} />
                                </div>
                                <div className="benefit-info">
                                    <h3>Personalized Recommendations</h3>
                                    <p>We’ll help you find the perfect book based on your taste.</p>
                                </div>
                            </div>

                            <div className="benefit-card">
                                <div className="benefit-icon clock">
                                    <Clock size={24} />
                                </div>
                                <div className="benefit-info">
                                    <h3>Late-Night Support</h3>
                                    <p>We stay online until late to serve your late-night reading needs.</p>
                                </div>
                            </div>

                            <div className="benefit-card">
                                <div className="benefit-icon shield">
                                    <ShieldCheck size={24} />
                                </div>
                                <div className="benefit-info">
                                    <h3>Secure Ordering</h3>
                                    <p>Safe and tracked checkout directly through our support team.</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="support-actions-card"
                        >
                            <div className="actions-header">
                                <PhoneCall size={32} />
                                <h2>Get in Touch</h2>
                                <p>Choose your preferred way to contact us</p>
                            </div>

                            <div className="action-buttons">
                                <button className="support-btn whatsapp" onClick={handleWhatsApp}>
                                    <div className="btn-content">
                                        <MessageCircle size={24} />
                                        <div className="btn-text">
                                            <span>WhatsApp</span>
                                            <small>Instant Chat</small>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} />
                                </button>

                                <button className="support-btn email" onClick={handleEmail}>
                                    <div className="btn-content">
                                        <Mail size={24} />
                                        <div className="btn-text">
                                            <span>Email Support</span>
                                            <small>Verified Ticket</small>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            <div className="support-status">
                                <div className="status-dot"></div>
                                <span>Support team is currently <strong>Online</strong></span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;

import React from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen,
    Mail,
    Phone
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <BookOpen className="logo-icon" size={28} />
                            <span className="logo-text">Lumina<span>Books</span></span>
                        </Link>
                        <p className="brand-description">
                            Your gateway to infinite worlds. We curate the best literature to ignite your imagination and enrich your soul.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h3>Shop</h3>
                        <ul>
                            <li><Link to="/catalog">All Books</Link></li>
                            <li><Link to="/cart">My Cart</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-links">
                        <h3>Support</h3>
                        <ul>
                            <li><Link to="/support">Contact Us</Link></li>
                            <li><Link to="/support">Support Center</Link></li>
                            <li><Link to="/support">WhatsApp Help</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h3>Contact Info</h3>
                        <div className="contact-items">
                            <div className="contact-item">
                                <Phone size={18} />
                                <span>+212 777 725 652</span>
                            </div>
                            <div className="contact-item">
                                <Mail size={18} />
                                <span>support@luminabooks.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} LuminaBooks. All rights reserved.</p>
                    <p className="made-with">
                        Reading is the key to knowledge.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

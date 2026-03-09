import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BookOpen, LogIn, Sun, Moon, Home, User, Package, ClipboardList, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
    const { getCartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
                <Link to="/" className="logo-group">
                    <BookOpen size={24} className="icon-main" />
                    <span className="logo-text">Lumina<span>Books</span></span>
                </Link>



                <div className="nav-links hide-on-mobile">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/catalog" className="nav-link">Catalog</Link>
                    <Link to="/my-orders" className="nav-link">My Orders</Link>
                    <Link to="/support" className="nav-link">Support</Link>
                    {user && user.role === 'admin' && <Link to="/admin" className="nav-link">Admin Dashboard</Link>}
                </div>

                <div className="nav-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/cart" className="action-item cart-anchor hide-on-mobile" aria-label="Cart">
                        <ShoppingCart size={20} />
                        {getCartCount() > 0 && <span className="badge-count">{getCartCount()}</span>}
                    </Link>

                    {!user ? (
                        <div className="auth-btns">
                            <Link to="/login" className="action-item">
                                <div className="btn-glass login-btn">Login</div>
                            </Link>
                            <Link to="/signup" className="action-item">
                                <div className="btn btn-primary join-btn">Join Us</div>
                            </Link>
                        </div>
                    ) : (
                        <div className="user-profile-nav" style={{ position: 'relative' }}>
                            <button
                                className="action-item user-avatar-btn"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <div className="avatar-initials">
                                    {user.name?.charAt(0) || user.userId?.charAt(0)}
                                </div>
                            </button>
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="user-dropdown"
                                    >
                                        <div className="user-dropdown-header">
                                            <p className="user-name">{user.name}</p>
                                            <p className="user-email">{user.email}</p>
                                        </div>
                                        {user.role === 'admin' && (
                                            <>
                                                <div className="dropdown-divider" />
                                                <Link to="/admin" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                                    Admin Dashboard
                                                </Link>
                                            </>
                                        )}
                                        <div className="dropdown-divider" />
                                        <button onClick={() => { logout(); setShowUserMenu(false); }} className="logout-btn">
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className="mobile-bottom-nav hide-on-desktop">
                <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Home size={20} />
                    <span>Home</span>
                </Link>
                <Link to="/catalog" className={`tab-item ${location.pathname === '/catalog' ? 'active' : ''}`}>
                    <Search size={20} />
                    <span>Explore</span>
                </Link>
                <Link to="/support" className={`tab-item ${location.pathname === '/support' ? 'active' : ''}`}>
                    <MessageCircle size={20} />
                    <span>Support</span>
                </Link>
                <Link to="/my-orders" className={`tab-item ${location.pathname === '/my-orders' ? 'active' : ''}`}>
                    <Package size={20} />
                    <span>Orders</span>
                </Link>
                <Link to="/cart" className={`tab-item cart-tab ${location.pathname === '/cart' ? 'active' : ''}`}>
                    <div className="cart-icon-wrapper">
                        <ShoppingCart size={20} />
                        {getCartCount() > 0 && <span className="tab-badge">{getCartCount()}</span>}
                    </div>
                    <span>Cart</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

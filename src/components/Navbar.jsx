import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BookOpen, LogIn, Sun, Moon } from 'lucide-react';
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

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="nav-links mobile-open"
                        >
                            <Link to="/catalog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
                            {!user && <Link to="/signup" className="nav-link" onClick={() => setIsMenuOpen(false)}>Join Us</Link>}
                            {user && <Link to="/my-orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Orders</Link>}
                            {user && user.role === 'admin' && <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>}

                            <div className="mobile-menu-footer">
                                <p>© 2026 LuminaBooks</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="nav-links desktop-only">
                    <Link to="/catalog" className="nav-link">Catalog</Link>
                    {!user && <Link to="/signup" className="nav-link">Join Us</Link>}
                    {user && <Link to="/my-orders" className="nav-link">My Orders</Link>}
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
                    <button className="action-item" aria-label="Search">
                        <Search size={20} />
                    </button>
                    {!user ? (
                        <Link to="/login" className="action-item" aria-label="Login">
                            <LogIn size={20} />
                        </Link>
                    ) : (
                        <div style={{ position: 'relative' }}>
                            <button
                                className="action-item"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)' }}
                            >
                                <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {user.userId}
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
                                        <div className="dropdown-divider" />
                                        <button onClick={logout} className="logout-btn">
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                    <Link to="/cart" className="action-item cart-anchor" aria-label="Cart">
                        <ShoppingCart size={20} />
                        {getCartCount() > 0 && <span className="badge-count">{getCartCount()}</span>}
                    </Link>
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

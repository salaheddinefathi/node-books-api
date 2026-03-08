import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, BookOpen, LogIn, Sun, Moon, Home, User, Package, ClipboardList } from 'lucide-react';
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
                            className="nav-links mobile-open hide-on-desktop"
                        >
                            <div className="mobile-menu-links">
                                <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                                <Link to="/catalog" className="nav-link" onClick={() => setIsMenuOpen(false)}>Catalog</Link>

                                {!user ? (
                                    <>
                                        <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                        <Link to="/signup" className="nav-link" onClick={() => setIsMenuOpen(false)}>Join Us</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/my-orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                                        )}
                                        <div className="dropdown-divider" style={{ margin: '1rem 0', opacity: 0.2 }} />
                                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="nav-link logout-text" style={{ textAlign: 'left', width: '100%', color: '#ef4444' }}>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="nav-links hide-on-mobile">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/catalog" className="nav-link">Catalog</Link>
                    <Link to="/my-orders" className="nav-link">My Orders</Link>
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
                        <div className="auth-btns hide-on-mobile" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: '0.5rem' }}>
                            <Link to="/login" className="action-item">
                                <div className="btn-glass" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '12px' }}>Login</div>
                            </Link>
                            <Link to="/signup" className="action-item">
                                <div className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Join Us</div>
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

                    <button
                        className="mobile-menu-btn hide-on-desktop"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className="mobile-bottom-nav hide-on-desktop">
                <Link to="/" className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <Home size={22} />
                    <span>Home</span>
                </Link>
                <Link to="/catalog" className={`tab-item ${location.pathname === '/catalog' ? 'active' : ''}`}>
                    <Search size={22} />
                    <span>Explore</span>
                </Link>
                <Link to="/my-orders" className={`tab-item ${location.pathname === '/my-orders' ? 'active' : ''}`}>
                    <Package size={22} />
                    <span>Orders</span>
                </Link>
                <Link to="/cart" className={`tab-item cart-tab ${location.pathname === '/cart' ? 'active' : ''}`}>
                    <div className="cart-icon-wrapper">
                        <ShoppingCart size={22} />
                        {getCartCount() > 0 && <span className="tab-badge">{getCartCount()}</span>}
                    </div>
                    <span>Cart</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

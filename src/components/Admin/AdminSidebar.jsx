import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Library,
    ShoppingBag,
    BarChart3,
    LogOut,
    Home,
    PlusSquare
} from 'lucide-react';
import './Sidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide bottom bar on scroll for mobile
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 50) { // scrolling down
                    setIsVisible(false);
                } else { // scrolling up
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem('lumina_auth_token');
        window.location.href = '/';
    };

    const isActive = (path, tab = null) => {
        if (!tab) return location.pathname === path && !location.search;
        return location.pathname === path && location.search.includes(`tab=${tab}`);
    };

    return (
        <aside className={`admin-sidebar ${!isVisible ? 'nav-hidden' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-container">
                    <PlusSquare size={24} className="sidebar-logo-icon" />
                </div>
                <span>Admin <span>Portal</span></span>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin?tab=library" className={`nav-item ${isActive('/admin', 'library') ? 'active' : ''}`}>
                        <Library size={20} />
                        <span>Books</span>
                    </Link>
                    <Link to="/admin?tab=orders" className={`nav-item ${isActive('/admin', 'orders') ? 'active' : ''}`}>
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/analytics" className={`nav-item ${isActive('/admin/analytics') ? 'active' : ''}`}>
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </Link>
                </div>

                <div className="nav-divider"></div>

                <div className="nav-group bottom-group">
                    <button onClick={handleLogout} className="nav-item logout">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    <Link to="/" className="nav-item home-link">
                        <Home size={20} />
                        <span>Back to Site</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import Catalog from './pages/Catalog';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import AdminLogin from './pages/AdminLogin';
import MyOrders from './pages/MyOrders';
import Analytics from './pages/Admin/Analytics';
import Support from './pages/Support';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AnimatePresence } from 'framer-motion';

import AdminLayout from './components/Admin/AdminLayout';

const NavigationRoutes = () => {
    const location = useLocation();
    const backgroundLocation = location.state?.backgroundLocation;
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin) {
        const isAdminLogin = location.pathname === '/admin/login';

        if (isAdminLogin) {
            return (
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="*" element={<Navigate to="/admin/login" replace />} />
                </Routes>
            );
        }

        return (
            <AdminLayout>
                <Routes>
                    <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
            </AdminLayout>
        );
    }

    return (
        <div className="app-content">
            {!isAuthPage && <Navbar />}
            <main>
                <AnimatePresence mode="wait">
                    <Routes location={backgroundLocation || location}>
                        {/* Main Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/book/:id" element={<BookDetails />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/my-orders" element={<MyOrders />} />
                        <Route path="/support" element={<Support />} />

                        {/* Auth */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AnimatePresence>

                {/* Modal Route (The Bottom Sheet Overlay) */}
                <AnimatePresence>
                    {backgroundLocation && (
                        <Routes location={location} key={location.pathname}>
                            <Route path="/book/:id" element={<BookDetails />} />
                        </Routes>
                    )}
                </AnimatePresence>
            </main>
            {!isAdmin && !isAuthPage && <Footer />}
        </div>
    );
};

const AppRouter = () => {
    return (
        <Router>
            <NavigationRoutes />
        </Router>
    );
};

export default AppRouter;

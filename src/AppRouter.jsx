import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin/analytics" element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                } />
                {/* Main Route with Home */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <main>
                            <Home />
                        </main>
                    </>
                } />

                <Route path="/catalog" element={
                    <>
                        <Navbar />
                        <main>
                            <Catalog />
                        </main>
                    </>
                } />

                <Route path="/book/:id" element={
                    <>
                        <Navbar />
                        <main>
                            <BookDetails />
                        </main>
                    </>
                } />

                <Route path="/cart" element={
                    <>
                        <Navbar />
                        <main>
                            <Cart />
                        </main>
                    </>
                } />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* My Orders */}
                <Route path="/my-orders" element={
                    <>
                        <Navbar />
                        <main>
                            <MyOrders />
                        </main>
                    </>
                } />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;

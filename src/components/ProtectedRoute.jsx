import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/auth/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAuthenticated(response.data.valid);
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
                localStorage.removeItem('adminToken');
            }
        };

        verifyToken();
    }, [token]);

    if (isAuthenticated === null) {
        return <div className="loading-screen">Verifying Access...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

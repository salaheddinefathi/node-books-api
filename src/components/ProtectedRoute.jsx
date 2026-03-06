import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('lumina_auth_token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAuthenticated(response.data.valid);
            } catch (error) {
                console.error('Token verification failed:', error);
                setIsAuthenticated(false);
                localStorage.removeItem('lumina_auth_token');
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

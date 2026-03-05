import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import toast from 'react-hot-toast';
import { Lock, User, LogIn, BookOpen } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', response.data.username);
            toast.success('Admin access granted', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Authentication failed', {
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    borderRadius: '10px',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <BookOpen size={28} />
                    </div>
                    <h2>Admin <span>Panel</span></h2>
                    <p>Enter your credentials to manage the bookstore</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <User size={18} />
                            <input
                                type="text"
                                name="username"
                                placeholder="Admin ID"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Security Key"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : (
                            <>
                                <LogIn size={18} />
                                Access Dashboard
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Protected area. All actions are logged.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            toast.success('Login successful! Welcome back', {
                style: {
                    borderRadius: '12px',
                    background: '#1c1917',
                    color: '#fff',
                    fontFamily: 'Outfit, sans-serif'
                }
            });
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="auth-card"
            >
                <div className="auth-header">
                    <div className="auth-logo">
                        <LogIn size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Enter your details to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-container">
                        <label>Email Address</label>
                        <div className="input-group">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="input-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label>Password</label>
                            <Link to="#" className="forgot-password">Forgot?</Link>
                        </div>
                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1.25rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '4px',
                                    zIndex: 5
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>



                    <button
                        disabled={loading}
                        type="submit"
                        className="auth-btn"
                    >
                        {loading ? 'Logging in...' : 'Sign In'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <Link to="/signup">Create Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

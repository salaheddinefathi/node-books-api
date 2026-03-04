import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData);
            toast.success('Registration successful! Welcome to LuminaBooks');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-main)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-card"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    backgroundColor: 'var(--bg-card)',
                    padding: '2.5rem',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: 'white'
                    }}>
                        <User size={32} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join Us</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create your account to start shopping</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your full name"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>Phone Number (Morocco)</label>
                        <div style={{ position: 'relative' }}>
                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+212 6..."
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem 0.8rem 3rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-main)'
                                }}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

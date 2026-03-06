import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Library,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Home,
    BarChart3,
    TrendingUp,
    Calendar,
    CalendarDays,
    CalendarRange,
    Eye,
    EyeOff,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    BookPlus
} from 'lucide-react';
import './Admin.css';
import SalesLineChart from '../../components/SalesLineChart';
import API_BASE_URL from '../../config/api';

const Analytics = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        dailyRevenue: 0,
        weeklyRevenue: 0,
        monthlyRevenue: 0,
        trends: { daily: 0, weekly: 0, monthly: 0 },
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [showNumbers, setShowNumbers] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('lumina_auth_token');
            const res = await fetch(`${API_BASE_URL}/api/analytics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const [profitTimeFilter, setProfitTimeFilter] = useState('month'); // 'day', 'week', 'month', 'total'
    const [chartTimeframe, setChartTimeframe] = useState('week'); // 'week', 'month'

    const getChartData = () => {
        if (!stats.chartData) return [];
        if (chartTimeframe === 'week') return stats.chartData.week;
        if (chartTimeframe === 'month') return stats.chartData.month;
        return [];
    };

    // Use stats from server
    const { dailyRevenue, weeklyRevenue, monthlyRevenue, totalRevenue, trends, totalOrders } = stats;

    // Dynamic Revenue Calculation (Total Sales) selector
    const getRevenueValue = () => {
        if (profitTimeFilter === 'day') return dailyRevenue;
        if (profitTimeFilter === 'week') return weeklyRevenue;
        if (profitTimeFilter === 'month') return monthlyRevenue;
        return totalRevenue;
    };

    const formatCurrency = (val) => {
        if (!showNumbers) return "••••••";
        return `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH`;
    };

    const handleLogout = () => {
        localStorage.removeItem('lumina_auth_token');
        window.location.href = '/';
    };

    return (
        <div className="admin-container">
            {/* Sidebar (Duplicate of Dashboard for consistency) */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <BookPlus size={24} className="sidebar-logo" />
                    <span>Admin <span>Portal</span></span>
                </div>
                <nav className="sidebar-nav">
                    <a href="/admin" className="nav-item">
                        <LayoutDashboard size={20} /><span>Dashboard</span>
                    </a>
                    <a href="/admin" className="nav-item">
                        <Library size={20} /><span>Books</span>
                    </a>
                    <a href="/admin" className="nav-item">
                        <ShoppingBag size={20} /><span>Orders</span>
                    </a>
                    <a href="/admin/analytics" className="nav-item active">
                        <BarChart3 size={20} /><span>Analytics</span>
                    </a>
                    <div className="nav-divider"></div>
                    <button onClick={handleLogout} className="nav-item logout">
                        <LogOut size={20} /><span>Logout</span>
                    </button>
                    <a href="/" className="nav-item home-link">
                        <Home size={20} /><span>Back to Site</span>
                    </a>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>Financial Analytics</h1>
                        <p>Track your business growth and profitability</p>
                    </div>
                    <button
                        className="privacy-toggle"
                        onClick={() => setShowNumbers(!showNumbers)}
                        title={showNumbers ? "Hide Balances" : "Show Balances"}
                    >
                        {showNumbers ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </header>

                <div className="profit-showcase-section" style={{ marginBottom: '2.5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="admin-section"
                        style={{ borderRight: '4px solid #4f46e5', background: 'linear-gradient(to right, var(--surface), var(--bg-main))' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sales</p>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0', color: '#4f46e5' }}>
                                    {formatCurrency(getRevenueValue())}
                                </h2>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Gross revenue from confirmed and delivered orders</p>
                            </div>
                            <div className="filter-pills" style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-main)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                {['day', 'week', 'month', 'total'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setProfitTimeFilter(p)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            border: 'none',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textTransform: 'capitalize',
                                            backgroundColor: profitTimeFilter === p ? '#4f46e5' : 'transparent',
                                            color: profitTimeFilter === p ? 'white' : 'var(--text-muted)'
                                        }}
                                    >
                                        {p === 'total' ? 'All Time' : p === 'day' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="analytics-grid">
                    {[
                        { label: 'Today', value: dailyRevenue, color: '#f59e0b', trend: trends.daily },
                        { label: 'This Week', value: weeklyRevenue, color: '#8b5cf6', trend: trends.weekly },
                        { label: 'This Month', value: monthlyRevenue, color: '#ec4899', trend: trends.monthly }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="admin-section"
                            style={{ padding: '1.25rem', borderLeft: `4px solid ${item.color}` }}
                        >
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label} Sales</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{formatCurrency(item.value)}</h3>
                                {item.trend !== 0 && (
                                    <span className={`trend-tag ${item.trend >= 0 ? 'pos' : 'neg'}`}>
                                        {item.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {Math.abs(item.trend).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="analytics-details-grid">
                    <section className="admin-section" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Sales Trend</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', background: 'var(--bg-main)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <button
                                    onClick={() => setChartTimeframe('week')}
                                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: 'none', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', backgroundColor: chartTimeframe === 'week' ? '#4f46e5' : 'transparent', color: chartTimeframe === 'week' ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => setChartTimeframe('month')}
                                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: 'none', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', backgroundColor: chartTimeframe === 'month' ? '#4f46e5' : 'transparent', color: chartTimeframe === 'month' ? 'white' : 'var(--text-muted)', transition: 'all 0.2s' }}
                                >
                                    This Month
                                </button>
                            </div>
                        </div>
                        <div style={{ minHeight: '250px', width: '100%', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                <SalesLineChart data={getChartData()} />
                            </div>
                        </div>
                    </section>

                    <section className="admin-section">
                        <div className="section-title">
                            <h2>Quick Summary</h2>
                        </div>
                        <div className="summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                <span>Avg Order Value</span>
                                <strong>{formatCurrency(totalRevenue / (totalOrders || 1))}</strong>
                            </div>
                            <div className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                <span>Total Transactions</span>
                                <strong>{totalOrders}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Analytics;

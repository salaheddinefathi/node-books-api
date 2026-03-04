import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    BookPlus,
    Library,
    Users,
    Settings,
    LogOut,
    TrendingUp,
    ShoppingBag,
    MoreVertical,
    Plus,
    X,
    Upload,
    Trash2,
    CheckCircle,
    XCircle,
    ExternalLink,
    Phone,
    Truck,
    Home,
    BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

const Dashboard = () => {
    const PUBLIC_BACKEND_URL = "http://localhost:5000";
    const [books, setBooks] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'library', or 'orders'
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Hide bottom bar on scroll for mobile
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) { // scrolling down
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState({ shippingCost: 0 });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${PUBLIC_BACKEND_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                console.log('Admin access issue - Redirecting to login');
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
                return;
            }

            const data = await res.json();
            if (res.ok) setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchLower) ||
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.items.some(item => item.title.toLowerCase().includes(searchLower));
        return matchesStatus && matchesSearch;
    });

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        category: 'Fiction',
        stock: '',
        description: ''
    });
    const [coverFile, setCoverFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const stats = [
        { label: "Total Books", value: books.length, icon: Library, color: "#4f46e5" },
        { label: "Active Orders", value: orders.filter(o => o.status === 'pending').length, icon: ShoppingBag, color: "#f59e0b" },
        { label: "Total Revenue", value: `$${orders.filter(o => o.status === 'confirmed').reduce((acc, o) => acc + o.total, 0).toFixed(2)}`, icon: TrendingUp, color: "#10b981" },
        { label: "Customers", value: "154", icon: Users, color: "#ec4899" },
    ];

    useEffect(() => {
        fetchBooks();
        fetchOrders();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${PUBLIC_BACKEND_URL}/api/settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
        }
    };

    const handleUpdateSettings = async (updates) => {
        setIsSavingSettings(true);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${PUBLIC_BACKEND_URL}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                setSettings(prev => ({ ...prev, ...updates }));
            }
        } catch (err) {
            console.error('Error updating settings:', err);
        } finally {
            setIsSavingSettings(false);
        }
    };

    const handleInlineUpdate = async (id, updates) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${PUBLIC_BACKEND_URL}/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (res.ok) {
                setBooks(prev => prev.map(book =>
                    book._id === id ? { ...book, ...updates } : book
                ));
                toast.success('Updated successfully', { position: 'bottom-right' });
            }
        } catch (err) {
            console.error('Inline update error:', err);
        }
    };

    const [error, setError] = useState(null);

    const fetchBooks = async () => {
        try {
            setError(null);
            const res = await fetch(`${PUBLIC_BACKEND_URL}/api/books`);
            const data = await res.json();

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
                return;
            }

            if (!res.ok) {
                throw new Error(data.message || 'Failed to fetch books');
            }

            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.message);
            setBooks([]);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(order =>
                    order._id === id ? { ...order, status: newStatus } : order
                ));
                if (selectedOrder && selectedOrder._id === id) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (err) {
            console.error('Update status error:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('stock', formData.stock);
        data.append('description', formData.description);
        if (coverFile) {
            data.append('cover', coverFile);
        }

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch('http://localhost:5000/api/books', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });
            if (res.status === 401) {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
                return;
            }
            if (res.ok) {
                setShowModal(false);
                fetchBooks();
                setFormData({ title: '', author: '', price: '', category: 'Fiction', stock: '', description: '' });
                setCoverFile(null);
            }
        } catch (err) {
            console.error('Error adding book:', err);
        }
    };

    const openDeleteModal = (id) => {
        setBookToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!bookToDelete) return;

        setIsDeleting(true);
        console.log('Attempting to delete book with ID:', bookToDelete);
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/books/${bookToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                console.log('Book deleted successfully');
                setShowDeleteModal(false);
                setBookToDelete(null);
                fetchBooks();
            } else {
                const data = await res.json();
                console.error('Delete failed:', data.message);
                alert(`Failed to delete: ${data.message}`);
            }
        } catch (err) {
            console.error('Error deleting book:', err);
            alert('Network error while deleting book');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/';
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${!isVisible ? 'nav-hidden' : ''}`}>
                <div className="sidebar-header">
                    <BookPlus size={24} className="sidebar-logo" />
                    <span>Admin <span>Portal</span></span>
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} /><span>Dashboard</span>
                    </button>
                    <button onClick={() => setActiveTab('library')} className={`nav-item ${activeTab === 'library' ? 'active' : ''}`}>
                        <Library size={20} /><span>Books</span>
                    </button>
                    <button onClick={() => setActiveTab('orders')} className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
                        <ShoppingBag size={20} /><span>Orders</span>
                    </button>
                    <a href="/admin/analytics" className="nav-item">
                        <BarChart3 size={20} /><span>Analytics</span>
                    </a>
                    <button className="nav-item">
                        <Users size={20} /><span>Clients</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className="nav-item">
                        <Settings size={20} /><span>Settings</span>
                    </button>
                    <button onClick={handleLogout} className="nav-item logout">
                        <LogOut size={20} /><span>Logout</span>
                    </button>
                    <div className="nav-divider hide-mobile"></div>
                    <a href="/" className="nav-item home-link">
                        <Home size={20} /><span>Back to Site</span>
                    </a>
                </nav>
            </aside>

            <main className="admin-main">
                {activeTab === 'dashboard' && (
                    <>
                        <header className="admin-header">
                            <div>
                                <h1>Overview</h1>
                                <p>Welcome back, Admin</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="add-book-btn"
                                onClick={() => setShowModal(true)}
                            >
                                <Plus size={20} /> Add New Book
                            </motion.button>
                        </header>

                        <div className="stats-grid">
                            {stats.map((stat, index) => (
                                <motion.div key={index} className="stat-card">
                                    <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <h3>{stat.value}</h3>
                                        <p>{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <section className="admin-section">
                            <div className="section-title">
                                <h2>Recent Order Activity</h2>
                                <button className="text-btn" onClick={() => setActiveTab('orders')}>View All Orders</button>
                            </div>
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order._id}>
                                                <td><span style={{ fontWeight: 600 }}>{order.orderNumber}</span></td>
                                                <td>{order.customerName}</td>
                                                <td>
                                                    <span className={`table-badge status-${order.status}`} style={{
                                                        backgroundColor: order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' :
                                                            order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: order.status === 'confirmed' ? '#10b981' :
                                                            order.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                                                        border: 'none',
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '20px'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="text-btn" onClick={() => { setSelectedOrder(order); }}>Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'library' && (
                    <>
                        <header className="admin-header">
                            <div>
                                <h1>Book Library</h1>
                                <p>Manage your inventory and stock levels</p>
                            </div>
                            <button className="add-book-btn" onClick={() => setShowModal(true)}>
                                <Plus size={20} /> Add New Book
                            </button>
                        </header>

                        <section className="admin-section">
                            <div className="section-title">
                                <h2>All Books</h2>
                                <button className="text-btn" onClick={fetchBooks}>Refresh List</button>
                            </div>

                            {/* Global Store Settings */}
                            <div className="admin-settings-row" style={{
                                display: 'flex',
                                gap: '1.5rem',
                                padding: '1.25rem',
                                backgroundColor: 'var(--surface)',
                                borderRadius: '16px',
                                marginBottom: '1.5rem',
                                border: '1px solid var(--border)',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Frais de Livraison (Global)</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>S'applique à toutes les nouvelles commandes</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
                                        <input
                                            type="number"
                                            value={settings.shippingCost}
                                            onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
                                            style={{
                                                padding: '0.6rem 0.6rem 0.6rem 1.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'var(--bg-main)',
                                                color: 'var(--text-main)',
                                                width: '100px',
                                                fontWeight: 700
                                            }}
                                        />
                                    </div>
                                    <button
                                        className="add-book-btn"
                                        style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                                        onClick={() => handleUpdateSettings({ shippingCost: parseFloat(settings.shippingCost) })}
                                        disabled={isSavingSettings}
                                    >
                                        {isSavingSettings ? 'Saving...' : 'Mettre à jour'}
                                    </button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Cover</th>
                                            <th>Title</th>
                                            <th className="hide-mobile">Author</th>
                                            <th className="hide-mobile">Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {error ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                                    <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
                                                        <strong>⚠️ Connection Error:</strong> {error}
                                                    </div>
                                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        Check if your MongoDB Atlas URI is correct in <code>server/.env</code>
                                                    </p>
                                                </td>
                                            </tr>
                                        ) : books && books.length > 0 ? books.map((book) => (
                                            <tr key={book._id}>
                                                <td>
                                                    <img
                                                        src={book.cover?.startsWith('http') ? book.cover : `${PUBLIC_BACKEND_URL}${book.cover}`}
                                                        alt={book.title}
                                                        style={{ width: '40px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                                                    />
                                                </td>
                                                <td><strong>{book.title}</strong></td>
                                                <td className="hide-mobile">{book.author}</td>
                                                <td className="hide-mobile"><span className="table-badge">{book.category}</span></td>
                                                <td>
                                                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ position: 'absolute', left: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>$</span>
                                                        <input
                                                            type="number"
                                                            defaultValue={book.price}
                                                            onBlur={(e) => handleInlineUpdate(book._id, { price: parseFloat(e.target.value) })}
                                                            style={{
                                                                width: '70px',
                                                                padding: '0.4rem 0.4rem 0.4rem 1.2rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid var(--border)',
                                                                backgroundColor: 'var(--bg-main)',
                                                                color: 'var(--text-main)',
                                                                fontSize: '0.85rem'
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        defaultValue={book.stock}
                                                        onBlur={(e) => handleInlineUpdate(book._id, { stock: parseInt(e.target.value) })}
                                                        style={{
                                                            width: '60px',
                                                            padding: '0.4rem',
                                                            borderRadius: '8px',
                                                            border: '1px solid var(--border)',
                                                            backgroundColor: 'var(--bg-main)',
                                                            color: book.stock < 10 ? "#ef4444" : "var(--text-main)",
                                                            fontWeight: book.stock < 10 ? 700 : 400,
                                                            fontSize: '0.85rem'
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="action-btn" onClick={() => openDeleteModal(book._id)} title="Delete">
                                                        <Trash2 size={16} color="#ef4444" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                                    No books found. Check database connection.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'orders' && (
                    <>
                        <header className="admin-header">
                            <div>
                                <h1>Order Management</h1>
                                <p>Track and verify customer orders</p>
                            </div>
                            <button className="text-btn" onClick={fetchOrders} style={{ fontWeight: 700 }}>
                                <Library size={16} /> Refresh Orders
                            </button>
                        </header>

                        <div className="orders-toolbar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="filter-tabs" style={{ display: 'flex', backgroundColor: 'var(--bg-main)', padding: '0.3rem', borderRadius: '12px', gap: '0.3rem' }}>
                                {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            backgroundColor: statusFilter === status ? 'var(--primary)' : 'transparent',
                                            color: statusFilter === status ? 'white' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            textTransform: 'capitalize',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <div className="search-bar" style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    placeholder="Search by customer or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: 'var(--bg-main)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>

                        <section className="admin-section">
                            <div className="table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Customer</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Details</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                            <tr key={order._id}>
                                                <td style={{ fontWeight: 700 }}>{order.orderNumber}</td>
                                                <td>
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontWeight: 600 }}>{order.customerName}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</span>
                                                    </div>
                                                </td>
                                                <td><span style={{ color: 'var(--primary)', fontWeight: 700 }}>${order.total.toFixed(2)}</span></td>
                                                <td>
                                                    <span className={`table-badge status-${order.status}`} style={{
                                                        backgroundColor: order.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' :
                                                            order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: order.status === 'confirmed' ? '#10b981' :
                                                            order.status === 'cancelled' ? '#ef4444' : '#f59e0b',
                                                        border: 'none',
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem'
                                                    }}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="add-book-btn"
                                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        View Items
                                                    </button>
                                                </td>
                                                <td>
                                                    <a href={`https://wa.me/${order.customerPhone}`} target="_blank" className="action-btn" title="Chat on WhatsApp">
                                                        <Phone size={18} color="#25D366" />
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                                    No orders found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Add Book Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                        >
                            <div className="modal-header">
                                <h2>Add New Book</h2>
                                <button onClick={() => setShowModal(false)}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Book Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g. The Great Gatsby"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Author</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            placeholder="Author name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Price ($)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            placeholder="19.99"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            placeholder="50"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option>Fiction</option>
                                            <option>Non-Fiction</option>
                                            <option>Fantasy</option>
                                            <option>Mystery</option>
                                            <option>Sci-Fi</option>
                                            <option>Self-Help</option>
                                            <option>Biography</option>
                                            <option>History</option>
                                            <option>Programming</option>
                                            <option>Technology</option>
                                            <option>Psychology</option>
                                            <option>Business</option>
                                            <option>Romance</option>
                                            <option>Horror</option>
                                            <option>Manga</option>
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Write a brief description of the book..."
                                            rows="3"
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border)',
                                                backgroundColor: 'var(--bg-main)',
                                                color: 'var(--text-main)',
                                                resize: 'vertical',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Cover Image</label>
                                        <div className="file-upload-wrapper">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setCoverFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="add-btn">Create Book Listing</button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                            style={{ maxWidth: '600px' }}
                        >
                            <div className="modal-header">
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Order Details</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        #{selectedOrder.orderNumber} • {selectedOrder.customerPhone} • {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : ''}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)}><X size={24} /></button>
                            </div>

                            <div className="order-items-scroll" style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="order-item-card" style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '12px',
                                        marginBottom: '0.8rem',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <img
                                            src={item.cover?.startsWith('http') ? item.cover : `${PUBLIC_BACKEND_URL}${item.cover}`}
                                            alt={item.title}
                                            style={{ width: '60px', height: '80px', borderRadius: '6px', objectFit: 'cover' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ marginBottom: '0.3rem' }}>{item.title}</h4>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                                                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span>Subtotal</span>
                                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span>Livraison</span>
                                        <span>${selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Payable</span>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${selectedOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    {selectedOrder.status === 'pending' && (
                                        <>
                                            <button
                                                className="btn-confirm"
                                                onClick={() => updateOrderStatus(selectedOrder._id, 'confirmed')}
                                                style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <CheckCircle size={18} /> Confirm Payment
                                            </button>
                                            <button
                                                className="btn-cancel"
                                                onClick={() => updateOrderStatus(selectedOrder._id, 'cancelled')}
                                                style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                            >
                                                <XCircle size={18} /> Cancel Order
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => window.open(`https://wa.me/${selectedOrder.customerPhone}`, '_blank')}
                                        style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', backgroundColor: '#25D366', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        <Phone size={18} /> Chat with Customer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content delete-modal"
                            style={{ maxWidth: '400px', textAlign: 'center' }}
                        >
                            <div className="modal-icon-warning" style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
                                <Trash2 size={48} />
                            </div>
                            <h3>Are you sure?</h3>
                            <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>
                                This action cannot be undone. This book will be permanently removed from your inventory.
                            </p>
                            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button
                                    className="btn-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{ padding: '0.8rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-confirm"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '8px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        opacity: isDeleting ? 0.7 : 1
                                    }}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Book'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;

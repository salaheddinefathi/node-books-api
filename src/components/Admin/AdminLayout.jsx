import React from 'react';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout-wrapper force-light-theme">
            <AdminSidebar />
            <main className="admin-content-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;

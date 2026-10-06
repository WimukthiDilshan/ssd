import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || !['admin', 'manager'].includes(user.role)) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-white">
      <AdminSidebar />
      <div className="ml-72 p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 

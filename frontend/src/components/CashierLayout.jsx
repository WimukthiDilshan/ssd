import React from 'react';
import { Navigate } from 'react-router-dom';
import CashierSidebar from './CashierSidebar';

const CashierLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || !['cashier', 'admin', 'manager'].includes(user.role)) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-white">
      <CashierSidebar />
      <div className="ml-72 p-8">
        {children}
      </div>
    </div>
  );
};

export default CashierLayout; 

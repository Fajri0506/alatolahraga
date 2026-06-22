import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0f19]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f19]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header inside Panel */}
        <header className="h-16 border-b border-white/5 bg-[#0f172a] flex items-center justify-between px-8">
          <div>
            <span className="text-gray-400 text-sm font-semibold">Selamat datang, </span>
            <span className="text-white font-bold">{user.nama}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
              Admin Mode
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
              {user.nama.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

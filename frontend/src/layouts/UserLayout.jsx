import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19]">
      {/* Top Header/Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-[#080b13] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 font-semibold">
            &copy; {new Date().getFullYear()} UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG. Dibuat dengan &hearts; untuk memfasilitasi gaya hidup sehat Anda.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;

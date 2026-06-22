import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 text-sm font-bold tracking-tight text-white sm:text-base">
          <img
            src="/logo.png"
            alt="Logo UKM Olahraga Polinela"
            className="h-9 w-9 object-contain"
            style={{ filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.5))' }}
          />
          <div className="flex flex-col leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-sm font-extrabold">UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">Beranda</Link>
          <Link to="/alat" className="text-gray-300 hover:text-white transition-colors duration-200">Daftar Alat</Link>
          
          {user && (
            <>
              <Link to="/riwayat" className="text-gray-300 hover:text-white transition-colors duration-200">Riwayat Sewa</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-200">
                  Panel Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Info / Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-200">{user.nama}</span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-1.5 text-sm font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200">
                Masuk
              </Link>
              <Link to="/register" className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 transition-all duration-200 cursor-pointer">
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-gray-400 hover:text-white md:hidden cursor-pointer focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mt-4 space-y-3 rounded-xl border border-white/5 bg-slate-900/95 p-4 backdrop-blur-lg md:hidden">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white transition-colors duration-200"
          >
            Beranda
          </Link>
          <Link
            to="/alat"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white transition-colors duration-200"
          >
            Daftar Alat
          </Link>
          
          {user && (
            <>
              <Link
                to="/riwayat"
                onClick={() => setIsOpen(false)}
                className="block text-gray-300 hover:text-white transition-colors duration-200"
              >
                Riwayat Sewa
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block text-emerald-400 font-semibold"
                >
                  Panel Admin
                </Link>
              )}
              <hr className="border-white/5 my-2" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-gray-300">Logged in as {user.nama}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-sm font-semibold text-gray-300 hover:text-white py-1.5 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 py-2 text-center text-sm font-semibold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 transition-all"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

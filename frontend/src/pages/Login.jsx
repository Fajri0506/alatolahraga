import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login gagal, periksa email & password Anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        
        {/* Elegant Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-black/50">
          
          {/* Logo UKM Olahraga Polinela */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-36 h-36 mb-5 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Logo UKM Olahraga Polinela" 
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'drop-shadow(0px 8px 20px rgba(0,0,0,0.6))'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150/0f172a/fbbf24?text=Logo";
                }}
              />
            </div>
            
            <h2 className="text-center text-lg font-black tracking-widest text-white mb-1 leading-tight uppercase">
              Sewa Alat & Barang
            </h2>
            <h3 className="text-center text-[1.4rem] font-black tracking-tight text-amber-500 mb-1 leading-tight uppercase">
              UKM Olahraga
            </h3>
            <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mt-1">
              Politeknik Negeri Lampung
            </p>
          </div>

          {error && (
            <div className="mb-8 rounded-xl bg-red-950/40 border border-red-900 p-4 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 pl-12 pr-4 py-3.5 text-white placeholder-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium text-sm"
                    placeholder="email@polinela.ac.id"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Kata Sandi
                  </label>
                  <Link to="#" className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors">
                    Lupa Sandi?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/50 pl-12 pr-4 py-3.5 text-white placeholder-slate-600 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-medium text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center items-center rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3.5 px-4 text-sm font-bold text-slate-900 shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900"></div>
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-base tracking-wide uppercase">Login Masuk</span>
                  </div>
                )}
              </button>
            </div>
            
            <p className="text-center text-sm font-medium text-slate-400 mt-6">
              Belum menjadi anggota?{' '}
              <Link to="/register" className="text-amber-500 hover:text-amber-400 font-bold transition-colors">
                Daftar Disini
              </Link>
            </p>
          </form>
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-slate-500 mt-8 font-medium">
          &copy; {new Date().getFullYear()} UKM Olahraga Polinela. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    no_hp: '',
    alamat: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register', formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registrasi gagal, mohon periksa data Anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass-panel p-8 rounded-2xl shadow-xl border border-white/5">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
              Masuk disini
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nama" className="block text-sm font-semibold text-gray-300 mb-1">
              Nama Lengkap
            </label>
            <input
              id="nama"
              name="nama"
              type="text"
              required
              value={formData.nama}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              placeholder="Budi Setiawan"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-1">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              placeholder="budi@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="no_hp" className="block text-sm font-semibold text-gray-300 mb-1">
              Nomor Handphone
            </label>
            <input
              id="no_hp"
              name="no_hp"
              type="text"
              value={formData.no_hp}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              placeholder="0812XXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="alamat" className="block text-sm font-semibold text-gray-300 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              placeholder="Jl. Mawar No. 123, Jakarta"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 px-4 text-sm font-bold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-55"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance, { getUploadUrl } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const DetailAlat = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await axiosInstance.get(`/alat/${id}`);
        setTool(response.data);
      } catch (error) {
        console.error('Error fetching tool details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [id]);

  const handleRentClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/sewa/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="text-center py-20 glass-panel rounded-2xl border border-white/5 space-y-4">
        <p className="text-gray-400 font-medium">Alat olahraga tidak ditemukan atau telah dihapus.</p>
        <Link to="/alat" className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white shadow-md">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <div>
        <Link to="/alat" className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      {/* Main Details Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-2xl">
        {/* Left Side: Photo */}
        <div className="rounded-xl overflow-hidden bg-slate-800 h-80 border border-white/5 relative">
          {tool.foto ? (
            <img
              src={getUploadUrl(tool.foto)}
              alt={tool.nama_alat}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-gray-500">
              <svg className="h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className="absolute top-4 left-4 bg-slate-900/80 text-cyan-400 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold border border-white/5">
            {tool.nama_kategori || 'Tanpa Kategori'}
          </span>
        </div>

        {/* Right Side: Specifications and Booking triggers */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{tool.nama_alat}</h2>
            
            {/* Condition & Status Badges */}
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                tool.stok > 0
                  ? 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20'
                  : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
              }`}>
                {tool.stok > 0 ? 'Tersedia' : 'Habis'}
              </span>
              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                tool.kondisi === 'baik'
                  ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
              }`}>
                Kondisi: {tool.kondisi.toUpperCase()}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">{tool.deskripsi || 'Tidak ada deskripsi rinci untuk produk ini.'}</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-gray-400">Harga Sewa Harian</span>
              <span className="text-2xl font-extrabold text-emerald-400">{formatRupiah(tool.harga_sewa)} <span className="text-sm text-gray-400">/ hari</span></span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 font-semibold">Stok Unit Tersedia</span>
              <span className="font-extrabold text-white">{tool.stok} unit</span>
            </div>

            <button
              onClick={handleRentClick}
              disabled={tool.stok <= 0}
              className={`w-full text-center rounded-xl py-3.5 text-sm font-bold shadow-lg transition-all duration-200 cursor-pointer ${
                tool.stok > 0
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/10'
                  : 'bg-slate-800 text-gray-500 cursor-not-allowed shadow-none'
              }`}
            >
              {tool.stok > 0 ? 'Sewa Sekarang' : 'Stok Unit Habis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAlat;

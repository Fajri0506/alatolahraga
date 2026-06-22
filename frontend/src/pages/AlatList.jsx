import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const AlatList = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get categories
      const catRes = await axiosInstance.get('/kategori');
      setCategories(catRes.data);

      // Get tools
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedKategori) queryParams.append('kategori', selectedKategori);
      
      const toolsRes = await axiosInstance.get(`/alat?${queryParams.toString()}`);
      setTools(toolsRes.data);
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedKategori]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Daftar Alat Olahraga</h1>
          <p className="text-gray-400">Pilih dan sewa peralatan olahraga favorit Anda</p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari alat olahraga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm w-full md:w-64"
          />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 cursor-pointer"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Categories Filtering Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        <button
          onClick={() => setSelectedKategori('')}
          className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer ${
            selectedKategori === ''
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-transparent text-white'
              : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          Semua Kategori
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id_kategori}
            onClick={() => setSelectedKategori(cat.id_kategori)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200 cursor-pointer ${
              selectedKategori === cat.id_kategori
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-transparent text-white'
                : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.nama_kategori}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <p className="text-gray-400 font-medium">Tidak ada alat olahraga yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div key={tool.id_alat} className="glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:scale-[1.02] transition-all duration-200 shadow-lg">
              {/* Product Photo */}
              <div className="h-48 w-full bg-slate-800 relative">
                {tool.foto ? (
                  <img
                    src={`http://localhost:5001/uploads/${tool.foto}`}
                    alt={tool.nama_alat}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-gray-500">
                    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Category Badge overlay */}
                <span className="absolute top-3 left-3 bg-[#0f172a]/80 text-cyan-400 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold border border-white/5">
                  {tool.nama_kategori || 'Tanpa Kategori'}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{tool.nama_alat}</h3>
                  <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">{tool.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 font-semibold">Harga Sewa</span>
                    <span className="text-emerald-400 font-extrabold">{formatRupiah(tool.harga_sewa)}/hari</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-semibold">Stok Tersedia</span>
                    <span className={`font-extrabold ${tool.stok > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                      {tool.stok > 0 ? `${tool.stok} unit` : 'Habis'}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/alat/${tool.id_alat}`}
                  className={`w-full text-center rounded-xl py-2.5 text-xs font-bold transition-all ${
                    tool.stok > 0
                      ? 'bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:border-transparent text-gray-200 hover:text-white cursor-pointer shadow-md'
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 cursor-not-allowed'
                  }`}
                  onClick={(e) => tool.stok <= 0 && e.preventDefault()}
                >
                  {tool.stok > 0 ? 'Detail & Sewa' : 'Tidak Tersedia'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlatList;

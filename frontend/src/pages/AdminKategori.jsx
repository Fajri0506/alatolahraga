import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminKategori = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/kategori');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setEditingId(category.id_kategori);
    setNamaKategori(category.nama_kategori);
    setDeskripsi(category.deskripsi || '');
    setFormError('');
    setFormSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNamaKategori('');
    setDeskripsi('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!namaKategori.trim()) {
      setFormError('Nama kategori wajib diisi!');
      return;
    }

    try {
      if (editingId) {
        // Edit Mode
        await axiosInstance.put(`/kategori/${editingId}`, { nama_kategori: namaKategori, deskripsi });
        setFormSuccess('Kategori berhasil diperbarui!');
      } else {
        // Add Mode
        await axiosInstance.post('/kategori', { nama_kategori: namaKategori, deskripsi });
        setFormSuccess('Kategori berhasil ditambahkan!');
      }
      
      // Reset form
      setNamaKategori('');
      setDeskripsi('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua alat yang berada di kategori ini akan diubah statusnya menjadi tanpa kategori.')) {
      return;
    }
    try {
      await axiosInstance.delete(`/kategori/${id}`);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus kategori');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Kelola Kategori Alat</h1>
        <p className="text-gray-400">Tambah, edit, dan hapus kategori cabang olahraga</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4 h-fit">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">
            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>

          {formError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama_kategori" className="block text-xs font-semibold text-gray-300 mb-1">Nama Kategori</label>
              <input
                id="nama_kategori"
                type="text"
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                placeholder="cth: Badminton"
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>
            
            <div>
              <label htmlFor="deskripsi" className="block text-xs font-semibold text-gray-300 mb-1">Deskripsi</label>
              <textarea
                id="deskripsi"
                rows="4"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Tulis deskripsi singkat..."
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                {editingId ? 'Update Kategori' : 'Simpan'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-gray-300 cursor-pointer"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Data Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Daftar Kategori</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-3 px-4 font-semibold w-12 text-center">No</th>
                  <th className="py-3 px-4 font-semibold">Nama Kategori</th>
                  <th className="py-3 px-4 font-semibold">Deskripsi</th>
                  <th className="py-3 px-4 font-semibold w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {categories.map((cat, idx) => (
                  <tr key={cat.id_kategori} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 text-center text-gray-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{cat.nama_kategori}</td>
                    <td className="py-3.5 px-4 text-xs max-w-xs truncate">{cat.deskripsi || '-'}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(cat)}
                          className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id_kategori)}
                          className="rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500 font-semibold">
                      Belum ada data kategori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKategori;

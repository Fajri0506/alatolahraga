import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminAlat = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form Fields
  const [idKategori, setIdKategori] = useState('');
  const [namaAlat, setNamaAlat] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [stok, setStok] = useState(0);
  const [hargaSewa, setHargaSewa] = useState(0);
  const [kondisi, setKondisi] = useState('baik');
  const [status, setStatus] = useState('tersedia');
  const [fotoFile, setFotoFile] = useState(null);

  // Messages
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const fetchData = async () => {
    try {
      const toolRes = await axiosInstance.get('/alat');
      setTools(toolRes.data);

      const catRes = await axiosInstance.get('/kategori');
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching admin tool data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setIdKategori('');
    setNamaAlat('');
    setDeskripsi('');
    setStok(0);
    setHargaSewa(0);
    setKondisi('baik');
    setStatus('tersedia');
    setFotoFile(null);
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tool) => {
    setEditingId(tool.id_alat);
    setIdKategori(tool.id_kategori || '');
    setNamaAlat(tool.nama_alat);
    setDeskripsi(tool.deskripsi || '');
    setStok(tool.stok);
    setHargaSewa(tool.harga_sewa);
    setKondisi(tool.kondisi);
    setStatus(tool.status);
    setFotoFile(null);
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!namaAlat.trim() || !hargaSewa) {
      setFormError('Nama alat dan harga sewa wajib diisi!');
      return;
    }

    // Use FormData for file upload support
    const formData = new FormData();
    formData.append('id_kategori', idKategori);
    formData.append('nama_alat', namaAlat);
    formData.append('deskripsi', deskripsi);
    formData.append('stok', stok);
    formData.append('harga_sewa', hargaSewa);
    formData.append('kondisi', kondisi);
    formData.append('status', status);
    if (fotoFile) {
      formData.append('foto', fotoFile);
    }

    try {
      if (editingId) {
        // Edit Mode
        await axiosInstance.put(`/alat/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Alat olahraga berhasil diperbarui!');
      } else {
        // Create Mode
        await axiosInstance.post('/alat', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Alat olahraga berhasil ditambahkan!');
      }

      setTimeout(() => {
        setIsFormOpen(false);
        fetchData();
      }, 1500);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal menyimpan alat olahraga');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus alat olahraga ini? Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }
    try {
      await axiosInstance.delete(`/alat/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus alat olahraga');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kelola Alat Olahraga</h1>
          <p className="text-gray-400">Kelola katalog barang, kuantitas stok, dan harga sewa harian</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenAdd}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 cursor-pointer"
          >
            Tambah Alat Baru
          </button>
        )}
      </div>

      {/* Form Panel */}
      {isFormOpen && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-base font-bold text-white">
              {editingId ? 'Edit Detail Alat Olahraga' : 'Tambah Alat Olahraga Baru'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              Tutup Form
            </button>
          </div>

          {formError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 font-semibold">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="nama_alat" className="block text-xs font-semibold text-gray-300 mb-1">Nama Alat</label>
                <input
                  id="nama_alat"
                  type="text"
                  required
                  value={namaAlat}
                  onChange={(e) => setNamaAlat(e.target.value)}
                  placeholder="cth: Bola Futsal Nike Strike"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="kategori_select" className="block text-xs font-semibold text-gray-300 mb-1">Kategori</label>
                  <select
                    id="kategori_select"
                    value={idKategori}
                    onChange={(e) => setIdKategori(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id_kategori} value={cat.id_kategori}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="harga_sewa" className="block text-xs font-semibold text-gray-300 mb-1">Harga Sewa Harian</label>
                  <input
                    id="harga_sewa"
                    type="number"
                    required
                    value={hargaSewa}
                    onChange={(e) => setHargaSewa(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stok" className="block text-xs font-semibold text-gray-300 mb-1">Stok Awal</label>
                  <input
                    id="stok"
                    type="number"
                    required
                    value={stok}
                    onChange={(e) => setStok(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="foto" className="block text-xs font-semibold text-gray-300 mb-1">Foto Alat (Max 5MB)</label>
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-200 hover:file:bg-white/10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="kondisi" className="block text-xs font-semibold text-gray-300 mb-1">Kondisi Barang</label>
                  <select
                    id="kondisi"
                    value={kondisi}
                    onChange={(e) => setKondisi(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="baik">BAIK</option>
                    <option value="rusak">RUSAK</option>
                    <option value="hilang">HILANG</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-xs font-semibold text-gray-300 mb-1">Status Ketersediaan</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="tersedia">TERSEDIA</option>
                    <option value="tidak_tersedia">TIDAK TERSEDIA</option>
                    <option value="rusak">RUSAK / MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="deskripsi" className="block text-xs font-semibold text-gray-300 mb-1">Deskripsi Alat</label>
                <textarea
                  id="deskripsi"
                  rows="4"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tulis deskripsi detail alat olahraga..."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Alat'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 text-xs font-semibold text-gray-300 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tools Table View */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Daftar Inventaris Alat</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="py-3 px-4 font-semibold w-16 text-center">Foto</th>
                <th className="py-3 px-4 font-semibold">Nama Alat</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Stok</th>
                <th className="py-3 px-4 font-semibold">Harga Sewa</th>
                <th className="py-3 px-4 font-semibold">Kondisi</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {tools.map((tool) => (
                <tr key={tool.id_alat} className="hover:bg-white/[0.01]">
                  <td className="py-3 px-4">
                    <div className="h-10 w-10 bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center text-xs">
                      {tool.foto ? (
                        <img
                          src={`http://localhost:5001/uploads/${tool.foto}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        '📷'
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">{tool.nama_alat}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-cyan-400">{tool.nama_kategori || 'Tanpa Kategori'}</td>
                  <td className="py-3.5 px-4 font-semibold">{tool.stok} unit</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{formatRupiah(tool.harga_sewa)}</td>
                  <td className="py-3.5 px-4 uppercase text-xs font-bold">{tool.kondisi}</td>
                  <td className="py-3.5 px-4 text-xs font-bold capitalize">{tool.status}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(tool)}
                        className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id_alat)}
                        className="rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500 font-semibold">
                    Belum ada data alat olahraga.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAlat;

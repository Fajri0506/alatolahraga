import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const SewaAlat = () => {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Form Fields
  const [tanggalSewa, setTanggalSewa] = useState(new Date().toISOString().split('T')[0]);
  const [tanggalKembali, setTanggalKembali] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow
  );
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Estimations
  const [days, setDays] = useState(1);
  const [totalCost, setTotalCost] = useState(0);

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

  // Recalculate duration and costs dynamically
  useEffect(() => {
    if (!tool) return;
    const start = new Date(tanggalSewa);
    const end = new Date(tanggalKembali);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      setDays(0);
      setTotalCost(0);
      return;
    }

    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) diffDays = 1;

    setDays(diffDays);
    setTotalCost(diffDays * parseFloat(tool.harga_sewa) * parseInt(jumlah));
  }, [tanggalSewa, tanggalKembali, jumlah, tool]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (days <= 0) {
      setError('Tanggal kembali tidak boleh kurang dari tanggal sewa!');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/penyewaan', {
        tanggal_sewa: tanggalSewa,
        tanggal_kembali: tanggalKembali,
        catatan,
        items: [
          {
            id_alat: parseInt(id),
            jumlah: parseInt(jumlah)
          }
        ]
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/riwayat');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mengajukan penyewaan, mohon coba kembali');
      setSubmitting(false);
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
        <p className="text-gray-400 font-medium">Alat olahraga tidak ditemukan.</p>
        <Link to="/alat" className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-bold text-white">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <div>
        <Link to={`/alat/${id}`} className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors duration-200">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Batal & Kembali ke Detail</span>
        </Link>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 shadow-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Form Pengajuan Sewa</h2>
          <p className="text-gray-400 text-sm mt-1">Mengisi detail tanggal dan kuantiti untuk pengajuan sewa.</p>
        </div>

        {success && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 font-semibold">
            Pengajuan sewa berhasil dibuat! Mengalihkan ke halaman riwayat...
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Form Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">Nama Alat</label>
              <input
                type="text"
                disabled
                value={tool.nama_alat}
                className="w-full rounded-xl border border-white/5 bg-slate-900/35 px-4 py-2.5 text-gray-400 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tanggal_sewa" className="block text-sm font-semibold text-gray-300 mb-1">Mulai Sewa</label>
                <input
                  id="tanggal_sewa"
                  type="date"
                  required
                  value={tanggalSewa}
                  onChange={(e) => setTanggalSewa(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label htmlFor="tanggal_kembali" className="block text-sm font-semibold text-gray-300 mb-1">Kembali Sewa</label>
                <input
                  id="tanggal_kembali"
                  type="date"
                  required
                  value={tanggalKembali}
                  onChange={(e) => setTanggalKembali(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="jumlah" className="block text-sm font-semibold text-gray-300 mb-1">Jumlah Unit (Max {tool.stok})</label>
              <input
                id="jumlah"
                type="number"
                min="1"
                max={tool.stok}
                required
                value={jumlah}
                onChange={(e) => setJumlah(Math.min(tool.stok, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label htmlFor="catatan" className="block text-sm font-semibold text-gray-300 mb-1">Catatan Tambahan</label>
              <textarea
                id="catatan"
                rows="3"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="cth: rompi tambahan, bola dalam kondisi pompa keras, dll."
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white focus:border-emerald-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Right Column: Pricing Estimates */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Estimasi Tagihan Sewa</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Harga per unit</span>
                  <span className="text-white font-medium">{formatRupiah(tool.harga_sewa)}/hari</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Jumlah Unit</span>
                  <span className="text-white font-medium">{jumlah} unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lama Sewa</span>
                  <span className="text-white font-medium">{days} hari</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-gray-300">Total Harga</span>
                <span className="text-2xl font-extrabold text-emerald-400">{formatRupiah(totalCost)}</span>
              </div>

              <button
                type="submit"
                disabled={submitting || success}
                className="w-full text-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg hover:from-emerald-400 hover:to-cyan-400 focus:outline-none cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="h-5 w-5 mx-auto animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  'Ajukan Penyewaan'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SewaAlat;

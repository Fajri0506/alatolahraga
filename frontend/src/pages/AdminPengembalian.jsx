import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminPengembalian = () => {
  const [returns, setReturns] = useState([]);
  const [activeRentals, setActiveRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [idPenyewaan, setIdPenyewaan] = useState('');
  const [tanggalDikembalikan, setTanggalDikembalikan] = useState(new Date().toISOString().split('T')[0]);
  const [kondisiKembali, setKondisiKembali] = useState('baik');
  const [catatan, setCatatan] = useState('');

  // Messages & feedback
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [fineResult, setFineResult] = useState(null);

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
      const returnRes = await axiosInstance.get('/pengembalian');
      setReturns(returnRes.data);

      const rentalRes = await axiosInstance.get('/penyewaan');
      // Filter for rentals that are actively out ('sedang_disewa' or 'terlambat')
      const active = rentalRes.data.filter(
        (r) => r.status === 'sedang_disewa' || r.status === 'terlambat'
      );
      setActiveRentals(active);
    } catch (error) {
      console.error('Error fetching return data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFineResult(null);

    if (!idPenyewaan) {
      setFormError('Pilih kode transaksi penyewaan terlebih dahulu!');
      return;
    }

    try {
      const response = await axiosInstance.post('/pengembalian', {
        id_penyewaan: parseInt(idPenyewaan),
        tanggal_dikembalikan: tanggalDikembalikan,
        kondisi_kembali: kondisiKembali,
        catatan
      });

      setFormSuccess('Pengembalian berhasil dicatat!');
      setFineResult({
        days: response.data.durasi_keterlambatan_hari,
        denda: response.data.denda
      });

      // Reset fields
      setIdPenyewaan('');
      setCatatan('');
      setKondisiKembali('baik');
      
      // Reload lists
      fetchData();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal mencatat pengembalian');
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Catat Pengembalian Alat</h1>
        <p className="text-gray-400">Proses barang kembali, hitung keterlambatan, denda keterlambatan / kerusakan secara otomatis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4 h-fit">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Form Pengembalian</h3>

          {formError && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              {formError}
            </div>
          )}
          
          {formSuccess && (
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 font-semibold space-y-1">
              <p>{formSuccess}</p>
              {fineResult && (
                <div className="pt-2 text-[11px] text-gray-300 space-y-1 border-t border-emerald-500/20 mt-2">
                  <p>Keterlambatan: <span className="text-white font-bold">{fineResult.days} hari</span></p>
                  <p>Total Denda: <span className="text-emerald-400 font-bold">{formatRupiah(fineResult.denda)}</span></p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rental_select" className="block text-xs font-semibold text-gray-300 mb-1">Transaksi Sewa Aktif</label>
              <select
                id="rental_select"
                value={idPenyewaan}
                onChange={(e) => setIdPenyewaan(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-955 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="">Pilih Penyewaan Aktif</option>
                {activeRentals.map((r) => (
                  <option key={r.id_penyewaan} value={r.id_penyewaan}>
                    #SR-{r.id_penyewaan} - {r.nama} (Kembali: {new Date(r.tanggal_kembali).toLocaleDateString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tanggal_dikembalikan" className="block text-xs font-semibold text-gray-300 mb-1">Tanggal Dikembalikan</label>
              <input
                id="tanggal_dikembalikan"
                type="date"
                required
                value={tanggalDikembalikan}
                onChange={(e) => setTanggalDikembalikan(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="kondisi_kembali" className="block text-xs font-semibold text-gray-300 mb-1">Kondisi Pengembalian</label>
              <select
                id="kondisi_kembali"
                value={kondisiKembali}
                onChange={(e) => setKondisiKembali(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-955 px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="baik">BAIK (Stok alat bertambah)</option>
                <option value="rusak">RUSAK (Stok alat dikurangi, denda 50k)</option>
                <option value="hilang">HILANG (Stok alat dikurangi, denda 150k)</option>
              </select>
            </div>

            <div>
              <label htmlFor="catatan" className="block text-xs font-semibold text-gray-300 mb-1">Catatan / Detail</label>
              <textarea
                id="catatan"
                rows="3"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="cth: raket senar putus, bola kempis, dll."
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-2.5 text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
            >
              Simpan Pengembalian
            </button>
          </form>
        </div>

        {/* Right Side: Return Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Data Pengembalian Selesai</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-3 px-4 font-semibold">ID Sewa</th>
                  <th className="py-3 px-4 font-semibold">Nama Penyewa</th>
                  <th className="py-3 px-4 font-semibold">Tanggal Kembali Aktual</th>
                  <th className="py-3 px-4 font-semibold">Kondisi</th>
                  <th className="py-3 px-4 font-semibold">Denda</th>
                  <th className="py-3 px-4 font-semibold">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {returns.map((ret) => (
                  <tr key={ret.id_pengembalian} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 font-bold text-white">#SR-{ret.id_penyewaan}</td>
                    <td className="py-3.5 px-4 font-semibold">{ret.nama_penyewa}</td>
                    <td className="py-3.5 px-4">{new Date(ret.tanggal_dikembalikan).toLocaleDateString('id-ID')}</td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset capitalize ${
                        ret.kondisi_kembali === 'baik'
                          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                      }`}>
                        {ret.kondisi_kembali}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-rose-400">{formatRupiah(ret.denda)}</td>
                    <td className="py-3.5 px-4 text-xs italic text-gray-400">"{ret.catatan || '-'}"</td>
                  </tr>
                ))}
                {returns.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500 font-semibold">
                      Belum ada data pengembalian alat.
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

export default AdminPengembalian;

import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminPenyewaan = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const fetchRentals = async () => {
    try {
      const response = await axiosInstance.get('/penyewaan');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/penyewaan/${id}/status`, { status: newStatus });
      fetchRentals();
      if (selectedRental && selectedRental.id_penyewaan === id) {
        // Refresh detail view if open
        const detailRes = await axiosInstance.get(`/penyewaan/${id}`);
        setSelectedRental(detailRes.data);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal mengubah status penyewaan');
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const response = await axiosInstance.get(`/penyewaan/${id}`);
      setSelectedRental(response.data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil detail penyewaan');
    }
  };

  const getStatusStyle = (status) => {
    const maps = {
      menunggu: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
      disetujui: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
      ditolak: 'bg-red-500/10 text-red-400 ring-red-500/20',
      sedang_disewa: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
      selesai: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',
      terlambat: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
      dibatalkan: 'bg-gray-500/10 text-gray-400 ring-gray-500/20'
    };
    return maps[status] || 'bg-gray-500/10 text-gray-400 ring-gray-500/20';
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Kelola Transaksi Penyewaan</h1>
        <p className="text-gray-400">Verifikasi permintaan sewa baru, ubah status sewa, dan pantau barang aktif</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: Table List */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Daftar Pengajuan Penyewaan</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Penyewa</th>
                  <th className="py-3 px-4 font-semibold">Periode</th>
                  <th className="py-3 px-4 font-semibold">Total Harga</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {rentals.map((rental) => (
                  <tr key={rental.id_penyewaan} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 font-bold text-white">#SR-{rental.id_penyewaan}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-200">{rental.nama}</div>
                      <div className="text-xs text-gray-500">{rental.no_hp || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div>S: {new Date(rental.tanggal_sewa).toLocaleDateString('id-ID')}</div>
                      <div>K: {new Date(rental.tanggal_kembali).toLocaleDateString('id-ID')}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">{formatRupiah(rental.total_harga)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset capitalize ${getStatusStyle(rental.status)}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleViewDetail(rental.id_penyewaan)}
                        className="rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {rentals.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500 font-semibold">
                      Belum ada data transaksi penyewaan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detail Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-6 h-fit">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Detail Transaksi</h3>

          {selectedRental ? (
            <div className="space-y-6 text-sm text-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs font-bold">KODE TRANSAKSI</p>
                  <p className="text-white font-bold">#SR-{selectedRental.id_penyewaan}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold">STATUS</p>
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset capitalize ${getStatusStyle(selectedRental.status)}`}>
                    {selectedRental.status}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-bold mb-1">INFORMASI PENYEWA</p>
                <div className="bg-slate-900/50 p-3 rounded-xl space-y-1">
                  <p className="text-white font-semibold">{selectedRental.nama}</p>
                  <p className="text-xs text-gray-400">{selectedRental.email}</p>
                  <p className="text-xs text-gray-400">Hp: {selectedRental.no_hp || '-'}</p>
                  <p className="text-xs text-gray-400">Alamat: {selectedRental.alamat || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs font-bold mb-2">DAFTAR BARANG YANG DISEWA</p>
                <div className="space-y-2">
                  {selectedRental.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg border border-white/5">
                      <div>
                        <p className="text-white font-semibold text-xs">{item.nama_alat}</p>
                        <p className="text-[10px] text-gray-400">{formatRupiah(item.harga_sewa)} x {item.jumlah} unit</p>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-gray-500 text-xs font-bold">AKSI ADMIN</p>
                
                {selectedRental.status === 'menunggu' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedRental.id_penyewaan, 'disetujui')}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                    >
                      Setujui Sewa
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRental.id_penyewaan, 'ditolak')}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Tolak Sewa
                    </button>
                  </div>
                )}

                {selectedRental.status === 'disetujui' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRental.id_penyewaan, 'sedang_disewa')}
                    className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                  >
                    Serahkan Barang (Mulai Sewa)
                  </button>
                )}

                {selectedRental.status === 'sedang_disewa' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedRental.id_penyewaan, 'terlambat')}
                    className="w-full rounded-xl bg-rose-500/10 border border-rose-500/20 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-505 hover:bg-rose-600 hover:text-white cursor-pointer"
                  >
                    Tandai Terlambat
                  </button>
                )}

                {!['menunggu', 'disetujui', 'sedang_disewa'].includes(selectedRental.status) && (
                  <p className="text-gray-500 text-xs text-center italic">Tidak ada tindakan lanjutan untuk status ini.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xs italic text-center py-10">Pilih salah satu transaksi untuk melihat detail & aksi admin.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPenyewaan;

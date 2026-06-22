import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentRentals, setRecentRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await axiosInstance.get('/dashboard/summary');
        setStats(statsRes.data);

        const rentalsRes = await axiosInstance.get('/penyewaan');
        // Get top 5 recent rentals
        setRecentRentals(rentalsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Jenis Alat', value: stats?.total_alat_jenis, icon: '📦', color: 'border-emerald-500/30 text-emerald-400' },
    { label: 'Total Stok Unit', value: stats?.total_alat_stok, icon: '🧩', color: 'border-cyan-500/30 text-cyan-400' },
    { label: 'Penyewa Terdaftar', value: stats?.total_user_penyewa, icon: '👥', color: 'border-purple-500/30 text-purple-400' },
    { label: 'Total Transaksi', value: stats?.total_penyewaan, icon: '📑', color: 'border-blue-500/30 text-blue-400' },
    { label: 'Penyewaan Aktif', value: stats?.total_alat_sedang_disewa, icon: '🏃', color: 'border-amber-500/30 text-amber-400' },
    { label: 'Menunggu Approval', value: stats?.total_penyewaan_menunggu, icon: '⏳', color: 'border-rose-500/30 text-rose-400' },
    { label: 'Pendapatan Bersih', value: formatRupiah(stats?.total_pendapatan || 0), icon: '💰', color: 'border-emerald-500/30 text-emerald-400 col-span-1 sm:col-span-2 md:col-span-3' },
    { label: 'Total Denda Masuk', value: formatRupiah(stats?.total_denda || 0), icon: '⚠️', color: 'border-rose-500/30 text-rose-400' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard Ringkasan</h1>
        <p className="text-gray-400">Ikhtisar data operasional sistem penyewaan alat olahraga</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`glass-card p-6 rounded-2xl border ${card.color} shadow-lg flex items-center justify-between`}>
            <div className="space-y-1">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{card.label}</span>
              <p className="text-2xl font-extrabold text-white">{card.value}</p>
            </div>
            <span className="text-3xl p-3 bg-white/5 rounded-xl">{card.icon}</span>
          </div>
        ))}
      </div>

      {/* Recent Rentals List */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Penyewaan Terbaru</h2>
          <Link to="/admin/penyewaan" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            Lihat Semua Penyewaan
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Nama Renter</th>
                <th className="py-3 px-4 font-semibold">Sewa</th>
                <th className="py-3 px-4 font-semibold">Kembali</th>
                <th className="py-3 px-4 font-semibold">Total Harga</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {recentRentals.map((rental) => (
                <tr key={rental.id_penyewaan} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-bold text-white">#SR-{rental.id_penyewaan}</td>
                  <td className="py-3.5 px-4 font-medium">{rental.nama}</td>
                  <td className="py-3.5 px-4">{new Date(rental.tanggal_sewa).toLocaleDateString('id-ID')}</td>
                  <td className="py-3.5 px-4">{new Date(rental.tanggal_kembali).toLocaleDateString('id-ID')}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-400">{formatRupiah(rental.total_harga)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${
                      rental.status === 'menunggu'
                        ? 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20'
                        : rental.status === 'disetujui'
                        ? 'bg-blue-500/10 text-blue-400 ring-blue-500/20'
                        : rental.status === 'ditolak'
                        ? 'bg-red-500/10 text-red-400 ring-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                    }`}>
                      {rental.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentRentals.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 font-semibold">
                    Belum ada data penyewaan.
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

export default AdminDashboard;

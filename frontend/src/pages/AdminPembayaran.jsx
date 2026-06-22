import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AdminPembayaran = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get('/pembayaran');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await axiosInstance.put(`/pembayaran/${id}/status`, { status });
      fetchPayments();
      
      // Update local state if selected is active
      if (selectedPayment && selectedPayment.id_pembayaran === id) {
        const detailRes = await axiosInstance.get(`/pembayaran/${id}`);
        setSelectedPayment(detailRes.data);
      }
    } catch (error) {
      console.error(error);
      alert('Gagal mengubah status verifikasi pembayaran');
    }
  };

  const handleSelectPayment = async (id) => {
    try {
      const response = await axiosInstance.get(`/pembayaran/${id}`);
      setSelectedPayment(response.data);
    } catch (error) {
      console.error(error);
      alert('Gagal mengambil detail pembayaran');
    }
  };

  const getStatusStyle = (status) => {
    const maps = {
      belum_bayar: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
      menunggu_verifikasi: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
      lunas: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
      ditolak: 'bg-red-500/10 text-red-400 ring-red-500/20'
    };
    return maps[status] || 'bg-gray-500/10 text-gray-400';
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Verifikasi Pembayaran</h1>
        <p className="text-gray-400">Verifikasi berkas bukti transfer, setujui status lunas, atau tolak bukti transfer pembayaran</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: Table List */}
        <div className="xl:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Daftar Setoran Pembayaran</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-gray-400">
                  <th className="py-3 px-4 font-semibold">No</th>
                  <th className="py-3 px-4 font-semibold">Penyewa</th>
                  <th className="py-3 px-4 font-semibold">ID Sewa</th>
                  <th className="py-3 px-4 font-semibold">Metode</th>
                  <th className="py-3 px-4 font-semibold">Jumlah</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {payments.map((p, idx) => (
                  <tr key={p.id_pembayaran} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{p.nama_penyewa}</td>
                    <td className="py-3.5 px-4">#SR-{p.id_penyewaan}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold">{p.metode_pembayaran}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">{formatRupiah(p.jumlah_bayar)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset capitalize ${getStatusStyle(p.status_pembayaran)}`}>
                        {p.status_pembayaran}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleSelectPayment(p.id_pembayaran)}
                        className="rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-all cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500 font-semibold">
                      Belum ada data setoran pembayaran.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detail & Verify Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl space-y-6 h-fit">
          <h3 className="text-base font-bold text-white border-b border-white/5 pb-2">Verifikasi & Bukti Transfer</h3>

          {selectedPayment ? (
            <div className="space-y-6 text-sm text-gray-300">
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-xs font-bold">NAMA PENYEWA</span>
                  <span className="text-white font-bold">{selectedPayment.nama_penyewa}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-xs font-bold">KODE TRANSAKSI SEWA</span>
                  <span className="text-white font-bold">#SR-{selectedPayment.id_penyewaan}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-xs font-bold">METODE PEMBAYARAN</span>
                  <span className="text-white font-medium">{selectedPayment.metode_pembayaran}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-xs font-bold">TANGGAL TRANSFER</span>
                  <span className="text-white font-medium">{new Date(selectedPayment.tanggal_bayar).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-500 text-xs font-bold">JUMLAH DIBAYAR</span>
                  <span className="text-emerald-400 font-extrabold">{formatRupiah(selectedPayment.jumlah_bayar)}</span>
                </div>
              </div>

              {/* Uploaded receipt photo */}
              <div>
                <span className="text-gray-500 text-xs font-bold block mb-2">BUKTI TRANSFER AKTUAL</span>
                {selectedPayment.bukti_pembayaran ? (
                  <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-950 flex flex-col justify-center items-center">
                    <a
                      href={`http://localhost:5001/uploads/${selectedPayment.bukti_pembayaran}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold mb-2 inline-block py-2"
                    >
                      Buka di Tab Baru
                    </a>
                    <div className="rounded-xl overflow-hidden bg-slate-900 border border-white/10 aspect-video flex items-center justify-center w-full">
                      <img
                        src={`http://localhost:5001/uploads/${selectedPayment.bukti_pembayaran}`}
                        alt="Bukti Transfer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-white/10 text-gray-500 rounded-xl">
                    Bukti transfer tidak diupload.
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <p className="text-gray-500 text-xs font-bold">VERIFIKASI ADMIN</p>
                {selectedPayment.status_pembayaran === 'menunggu_verifikasi' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleVerify(selectedPayment.id_pembayaran, 'lunas')}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                    >
                      Setujui Lunas
                    </button>
                    <button
                      onClick={() => handleVerify(selectedPayment.id_pembayaran, 'ditolak')}
                      className="rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
                    >
                      Tolak Bukti
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs text-center italic">
                    Pembayaran telah diverifikasi sebagai: <span className="text-white capitalize font-semibold">{selectedPayment.status_pembayaran}</span>.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xs italic text-center py-10">Pilih salah satu setoran pembayaran untuk melakukan verifikasi bukti transfer.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPembayaran;

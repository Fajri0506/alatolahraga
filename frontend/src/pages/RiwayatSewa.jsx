import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const RiwayatSewa = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentRentalId, setActivePaymentRentalId] = useState(null);

  // Payment Form State
  const [metodePembayaran, setMetodePembayaran] = useState('Transfer BCA');
  const [jumlahBayar, setJumlahBayar] = useState(0);
  const [tanggalBayar, setTanggalBayar] = useState(new Date().toISOString().split('T')[0]);
  const [buktiFile, setBuktiFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Payment status of each rental
  const [payments, setPayments] = useState({});

  // Helper formatting
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const fetchRentalsAndPayments = async () => {
    try {
      const response = await axiosInstance.get('/penyewaan/user');
      setRentals(response.data);

      // Fetch payments for user
      const payRes = await axiosInstance.get('/pembayaran/user');
      const paymentsMap = {};
      payRes.data.forEach((p) => {
        paymentsMap[p.id_penyewaan] = p;
      });
      setPayments(paymentsMap);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalsAndPayments();
  }, []);

  const openPaymentPanel = (rental) => {
    setActivePaymentRentalId(rental.id_penyewaan);
    setJumlahBayar(rental.total_harga);
    setFormError('');
    setFormSuccess('');
    setBuktiFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBuktiFile(e.target.files[0]);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!buktiFile) {
      setFormError('Mohon lampirkan file bukti pembayaran!');
      return;
    }

    setSubmitLoading(true);
    
    // Create Multi-part Form Data
    const formData = new FormData();
    formData.append('id_penyewaan', activePaymentRentalId);
    formData.append('metode_pembayaran', metodePembayaran);
    formData.append('jumlah_bayar', jumlahBayar);
    formData.append('tanggal_bayar', tanggalBayar);
    formData.append('bukti_pembayaran', buktiFile);

    try {
      await axiosInstance.post('/pembayaran', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFormSuccess('Bukti pembayaran berhasil dikirim!');
      setTimeout(() => {
        setActivePaymentRentalId(null);
        fetchRentalsAndPayments();
      }, 1500);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Gagal mengirim pembayaran, mohon coba kembali');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusPill = (status) => {
    const maps = {
      menunggu: { bg: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20', label: 'Menunggu Persetujuan' },
      disetujui: { bg: 'bg-blue-500/10 text-blue-400 ring-blue-500/20', label: 'Disetujui Admin' },
      ditolak: { bg: 'bg-red-500/10 text-red-400 ring-red-500/20', label: 'Ditolak' },
      sedang_disewa: { bg: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20', label: 'Sedang Disewa' },
      selesai: { bg: 'bg-slate-500/10 text-slate-400 ring-slate-500/20', label: 'Selesai' },
      terlambat: { bg: 'bg-rose-500/10 text-rose-400 ring-rose-500/20', label: 'Terlambat' },
      dibatalkan: { bg: 'bg-gray-500/10 text-gray-400 ring-gray-500/20', label: 'Dibatalkan' }
    };
    const pill = maps[status] || { bg: 'bg-gray-500/10 text-gray-400 ring-gray-500/20', label: status };
    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${pill.bg}`}>
        {pill.label}
      </span>
    );
  };

  const getPaymentStatusPill = (status) => {
    const maps = {
      belum_bayar: { bg: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20', label: 'Belum Bayar' },
      menunggu_verifikasi: { bg: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20', label: 'Menunggu Verifikasi' },
      lunas: { bg: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20', label: 'Lunas' },
      ditolak: { bg: 'bg-red-500/10 text-red-400 ring-red-500/20', label: 'Bukti Ditolak' }
    };
    const pill = maps[status] || { bg: 'bg-gray-500/10 text-gray-400 ring-gray-500/20', label: status };
    return (
      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${pill.bg}`}>
        {pill.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Riwayat Penyewaan Saya</h1>
        <p className="text-gray-400">Pantau status persetujuan, denda, dan lakukan pembayaran penyewaan Anda</p>
      </div>

      {rentals.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <p className="text-gray-400 font-medium">Anda belum pernah melakukan pengajuan sewa.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((rental) => {
            const payment = payments[rental.id_penyewaan];
            const isPaymentOpen = activePaymentRentalId === rental.id_penyewaan;

            return (
              <div key={rental.id_penyewaan} className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg space-y-4">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 font-semibold">Kode Transaksi: <span className="text-white">#SR-{rental.id_penyewaan}</span></p>
                    <p className="text-xs text-gray-500">Dibuat pada: {new Date(rental.created_at).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusPill(rental.status)}
                    {payment && getPaymentStatusPill(payment.status_pembayaran)}
                    {!payment && rental.status !== 'menunggu' && rental.status !== 'ditolak' && rental.status !== 'dibatalkan' && (
                      <span className="inline-flex items-center rounded-md bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-yellow-400 ring-1 ring-inset ring-yellow-500/20">
                        Belum Bayar
                      </span>
                    )}
                  </div>
                </div>

                {/* Rental Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2">
                    <p className="text-gray-400 font-semibold">Durasi Penyewaan</p>
                    <p className="text-white font-medium">
                      {new Date(rental.tanggal_sewa).toLocaleDateString('id-ID', { dateStyle: 'medium' })} -{' '}
                      {new Date(rental.tanggal_kembali).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 font-semibold">Total Tagihan</p>
                    <p className="text-emerald-400 text-base font-extrabold">{formatRupiah(rental.total_harga)}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 font-semibold">Catatan Anda</p>
                    <p className="text-gray-300 italic">"{rental.catatan || '-'}"</p>
                  </div>
                </div>

                {/* Payment actions panel */}
                {rental.status !== 'menunggu' && rental.status !== 'ditolak' && rental.status !== 'dibatalkan' && (
                  <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                    {/* Payment detail display */}
                    {payment && (
                      <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500 font-semibold">Metode Pembayaran</p>
                          <p className="text-white font-medium">{payment.metode_pembayaran}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold">Jumlah Dibayar</p>
                          <p className="text-white font-medium">{formatRupiah(payment.jumlah_bayar)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-semibold">Tanggal Pembayaran</p>
                          <p className="text-white font-medium">{new Date(payment.tanggal_bayar).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    )}

                    {/* Pay trigger / Retry pay trigger */}
                    {(!payment || payment.status_pembayaran === 'ditolak') && !isPaymentOpen && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => openPaymentPanel(rental)}
                          className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-400 hover:to-cyan-400 cursor-pointer"
                        >
                          {payment?.status_pembayaran === 'ditolak' ? 'Upload Ulang Bukti Bayar' : 'Bayar Sekarang'}
                        </button>
                      </div>
                    )}

                    {/* Payment Submission Panel */}
                    {isPaymentOpen && (
                      <form onSubmit={handlePaymentSubmit} className="bg-slate-900/60 p-6 rounded-xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <h4 className="text-sm font-bold text-white">Upload Bukti Pembayaran</h4>
                          <button
                            type="button"
                            onClick={() => setActivePaymentRentalId(null)}
                            className="text-gray-400 hover:text-white text-xs font-bold cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>

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

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Metode Transfer</label>
                            <select
                              value={metodePembayaran}
                              onChange={(e) => setMetodePembayaran(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                            >
                              <option>Transfer Bank BCA (12345678 a/n UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG)</option>
                              <option>Transfer Bank Mandiri (98765432 a/n UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG)</option>
                              <option>E-Wallet OVO / GoPay (08123456789 a/n UKM OLAHRAGA POLITEKNIK NEGERI LAMPUNG)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Jumlah Bayar</label>
                            <input
                              type="number"
                              disabled
                              value={jumlahBayar}
                              className="w-full rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-gray-400 text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1">Tanggal Transfer</label>
                            <input
                              type="date"
                              required
                              value={tanggalBayar}
                              onChange={(e) => setTanggalBayar(e.target.value)}
                              className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 mb-1">Foto Bukti Transfer (Max 5MB)</label>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleFileChange}
                            className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-200 file:cursor-pointer hover:file:bg-white/10"
                          />
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={submitLoading}
                            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-white shadow-md disabled:opacity-50 cursor-pointer"
                          >
                            {submitLoading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RiwayatSewa;

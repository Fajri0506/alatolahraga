const PembayaranModel = require('../models/pembayaranModel');
const PenyewaanModel = require('../models/penyewaanModel');
const path = require('path');

// Helper: generate unique filename (for memoryStorage)
const generateFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return uniqueSuffix + path.extname(file.originalname);
};

const PembayaranController = {
  createPembayaran: async (req, res, next) => {
    try {
      const { id_penyewaan, metode_pembayaran, jumlah_bayar, tanggal_bayar } = req.body;

      if (!id_penyewaan || !metode_pembayaran || !jumlah_bayar || !tanggal_bayar) {
        return res.status(400).json({ message: 'Data pembayaran tidak lengkap' });
      }

      // Check if rental exists
      const rental = await PenyewaanModel.getById(id_penyewaan);
      if (!rental) {
        return res.status(404).json({ message: 'Penyewaan tidak ditemukan' });
      }

      // Check if user owns the rental
      if (req.user.role !== 'admin' && rental.id_user !== req.user.id_user) {
        return res.status(403).json({ message: 'Akses ditolak' });
      }

      const bukti_pembayaran = req.file ? generateFilename(req.file) : null;

      // Check if payment already exists
      const existingPayment = await PembayaranModel.getByRentalId(id_penyewaan);
      if (existingPayment) {
        if (existingPayment.status_pembayaran === 'lunas') {
          return res.status(400).json({ message: 'Pembayaran untuk transaksi ini sudah lunas' });
        }

        // Update payment details and reset status to 'menunggu_verifikasi'
        await PembayaranModel.updatePayment(existingPayment.id_pembayaran, {
          metode_pembayaran,
          jumlah_bayar: parseFloat(jumlah_bayar),
          status_pembayaran: 'menunggu_verifikasi',
          tanggal_bayar,
          bukti_pembayaran
        });

        return res.status(200).json({
          message: 'Bukti pembayaran berhasil diupload ulang, menunggu verifikasi admin',
          id_pembayaran: existingPayment.id_pembayaran
        });
      }

      // Create new payment entry
      const id_pembayaran = await PembayaranModel.createPayment({
        id_penyewaan,
        metode_pembayaran,
        jumlah_bayar: parseFloat(jumlah_bayar),
        status_pembayaran: 'menunggu_verifikasi',
        tanggal_bayar,
        bukti_pembayaran
      });

      res.status(201).json({
        message: 'Pembayaran berhasil dikirim, menunggu verifikasi admin',
        id_pembayaran
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPembayaran: async (req, res, next) => {
    try {
      const payments = await PembayaranModel.getAll();
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  },

  getUserPembayaran: async (req, res, next) => {
    try {
      const payments = await PembayaranModel.getByUser(req.user.id_user);
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  },

  getPembayaranById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const payment = await PembayaranModel.getById(id);

      if (!payment) {
        return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
      }

      // Check authorization
      if (req.user.role !== 'admin') {
        const rental = await PenyewaanModel.getById(payment.id_penyewaan);
        if (!rental || rental.id_user !== req.user.id_user) {
          return res.status(403).json({ message: 'Akses ditolak' });
        }
      }

      res.status(200).json(payment);
    } catch (error) {
      next(error);
    }
  },

  verifikasiPembayaran: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'lunas' or 'ditolak'

      if (!status || !['lunas', 'ditolak'].includes(status)) {
        return res.status(400).json({ message: "Status tidak valid. Harus 'lunas' atau 'ditolak'" });
      }

      const payment = await PembayaranModel.getById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
      }

      await PembayaranModel.updateStatus(id, status);

      // If lunas, let's also update the rental's status to 'sedang_disewa' if it was 'disetujui'
      if (status === 'lunas') {
        const rental = await PenyewaanModel.getById(payment.id_penyewaan);
        if (rental && rental.status === 'disetujui') {
          await PenyewaanModel.updateStatus(payment.id_penyewaan, 'sedang_disewa');
        }
      }

      res.status(200).json({ message: `Status pembayaran berhasil diubah menjadi ${status}` });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PembayaranController;

const PenyewaanModel = require('../models/penyewaanModel');
const AlatModel = require('../models/alatModel');

const PenyewaanController = {
  createPenyewaan: async (req, res, next) => {
    try {
      const { tanggal_sewa, tanggal_kembali, catatan, items } = req.body;
      const id_user = req.user.id_user;

      if (!tanggal_sewa || !tanggal_kembali || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Data penyewaan tidak lengkap' });
      }

      // 1. Calculate duration (days)
      const start = new Date(tanggal_sewa);
      const end = new Date(tanggal_kembali);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: 'Format tanggal sewa atau tanggal kembali tidak valid' });
      }

      if (end < start) {
        return res.status(400).json({ message: 'Tanggal kembali tidak boleh kurang dari tanggal sewa' });
      }

      const diffTime = Math.abs(end - start);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) diffDays = 1; // Minimum 1 day rental

      // 2. Fetch prices and calculate total_harga securely
      let total_harga = 0;
      for (const item of items) {
        const tool = await AlatModel.getById(item.id_alat);
        if (!tool) {
          return res.status(404).json({ message: `Alat olahraga dengan ID ${item.id_alat} tidak ditemukan` });
        }
        if (tool.stok < item.jumlah) {
          return res.status(400).json({ message: `Stok alat olahraga "${tool.nama_alat}" tidak mencukupi (Tersedia: ${tool.stok})` });
        }
        total_harga += parseFloat(tool.harga_sewa) * parseInt(item.jumlah);
      }

      total_harga = total_harga * diffDays;

      // 3. Create rental
      const id_penyewaan = await PenyewaanModel.createRental(id_user, {
        tanggal_sewa,
        tanggal_kembali,
        total_harga,
        catatan,
        items
      });

      res.status(201).json({
        message: 'Pengajuan penyewaan berhasil dibuat',
        id_penyewaan,
        total_harga
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPenyewaan: async (req, res, next) => {
    try {
      const { status } = req.query;
      const rentals = await PenyewaanModel.getAll(status);
      res.status(200).json(rentals);
    } catch (error) {
      next(error);
    }
  },

  getUserPenyewaan: async (req, res, next) => {
    try {
      const rentals = await PenyewaanModel.getByUser(req.user.id_user);
      res.status(200).json(rentals);
    } catch (error) {
      next(error);
    }
  },

  getPenyewaanById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const rental = await PenyewaanModel.getById(id);

      if (!rental) {
        return res.status(404).json({ message: 'Penyewaan tidak ditemukan' });
      }

      // Access control: User can only view their own rentals, Admin can view all
      if (req.user.role !== 'admin' && rental.id_user !== req.user.id_user) {
        return res.status(403).json({ message: 'Akses ditolak' });
      }

      res.status(200).json(rental);
    } catch (error) {
      next(error);
    }
  },

  updateStatusPenyewaan: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['menunggu', 'disetujui', 'ditolak', 'sedang_disewa', 'selesai', 'terlambat', 'dibatalkan'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
      }

      await PenyewaanModel.updateStatus(id, status);
      res.status(200).json({ message: `Status penyewaan berhasil diubah menjadi ${status}` });
    } catch (error) {
      next(error);
    }
  },

  deletePenyewaan: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const rental = await PenyewaanModel.getById(id);
      if (!rental) {
        return res.status(404).json({ message: 'Penyewaan tidak ditemukan' });
      }

      // Only allow user to delete if status is still 'menunggu' or 'dibatalkan', Admin can delete anytime
      if (req.user.role !== 'admin') {
        if (rental.id_user !== req.user.id_user) {
          return res.status(403).json({ message: 'Akses ditolak' });
        }
        if (rental.status !== 'menunggu' && rental.status !== 'dibatalkan') {
          return res.status(400).json({ message: 'Penyewaan yang sudah diproses tidak dapat dihapus' });
        }
      }

      await PenyewaanModel.delete(id);
      res.status(200).json({ message: 'Penyewaan berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PenyewaanController;

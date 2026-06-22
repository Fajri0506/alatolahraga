const PengembalianModel = require('../models/pengembalianModel');
const PenyewaanModel = require('../models/penyewaanModel');

const PengembalianController = {
  createPengembalian: async (req, res, next) => {
    try {
      const { id_penyewaan, tanggal_dikembalikan, kondisi_kembali, catatan } = req.body;

      if (!id_penyewaan || !tanggal_dikembalikan) {
        return res.status(400).json({ message: 'ID penyewaan dan tanggal dikembalikan wajib diisi' });
      }

      // 1. Fetch rental details
      const rental = await PenyewaanModel.getById(id_penyewaan);
      if (!rental) {
        return res.status(404).json({ message: 'Penyewaan tidak ditemukan' });
      }

      // Check if rental is already completed/returned
      const existingReturn = await PengembalianModel.getByRentalId(id_penyewaan);
      if (existingReturn) {
        return res.status(400).json({ message: 'Pengembalian untuk transaksi ini sudah dicatat' });
      }

      // 2. Normalize dates to midnight to compare days correctly
      const dateKembali = new Date(rental.tanggal_kembali);
      const dateDikembalikan = new Date(tanggal_dikembalikan);

      dateKembali.setHours(0,0,0,0);
      dateDikembalikan.setHours(0,0,0,0);

      let lateDays = 0;
      let denda = 0;

      // Late denda: 20,000 IDR per day
      if (dateDikembalikan > dateKembali) {
        const diffTime = dateDikembalikan - dateKembali;
        lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        denda += lateDays * 20000;
      }

      // Damage/loss denda
      if (kondisi_kembali === 'rusak') {
        denda += 50000; // 50k IDR for damaged items
      } else if (kondisi_kembali === 'hilang') {
        denda += 150000; // 150k IDR for lost items
      }

      // 3. Save return
      const id_pengembalian = await PengembalianModel.createReturn({
        id_penyewaan,
        tanggal_dikembalikan,
        kondisi_kembali,
        denda,
        catatan
      });

      res.status(201).json({
        message: 'Pengembalian berhasil dicatat',
        id_pengembalian,
        durasi_keterlambatan_hari: lateDays,
        denda
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPengembalian: async (req, res, next) => {
    try {
      const returns = await PengembalianModel.getAll();
      res.status(200).json(returns);
    } catch (error) {
      next(error);
    }
  },

  getPengembalianById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await PengembalianModel.getById(id);

      if (!data) {
        return res.status(404).json({ message: 'Data pengembalian tidak ditemukan' });
      }

      // Check authorization
      if (req.user.role !== 'admin') {
        // User must own the rental associated with the return
        const rental = await PenyewaanModel.getById(data.id_penyewaan);
        if (!rental || rental.id_user !== req.user.id_user) {
          return res.status(403).json({ message: 'Akses ditolak' });
        }
      }

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PengembalianController;

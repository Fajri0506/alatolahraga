const db = require('../config/database');

const DashboardController = {
  getSummary: async (req, res, next) => {
    try {
      // Execute queries in parallel for better performance
      const [
        [alatCount],
        [userCount],
        [rentalCount],
        [waitingCount],
        [rentedCount],
        [paymentCount],
        [revenueCount],
        [fineCount]
      ] = await Promise.all([
        db.query('SELECT COUNT(id_alat) as count, SUM(stok) as total_stok FROM alat_olahraga'),
        db.query("SELECT COUNT(id_user) as count FROM users WHERE role = 'penyewa'"),
        db.query('SELECT COUNT(id_penyewaan) as count FROM penyewaan'),
        db.query("SELECT COUNT(id_penyewaan) as count FROM penyewaan WHERE status = 'menunggu'"),
        db.query("SELECT COUNT(id_penyewaan) as count FROM penyewaan WHERE status = 'sedang_disewa'"),
        db.query("SELECT COUNT(id_pembayaran) as count FROM pembayaran WHERE status_pembayaran = 'lunas'"),
        db.query("SELECT SUM(jumlah_bayar) as count FROM pembayaran WHERE status_pembayaran = 'lunas'"),
        db.query('SELECT SUM(denda) as count FROM pengembalian')
      ]);

      res.status(200).json({
        total_alat_jenis: alatCount[0].count || 0,
        total_alat_stok: parseInt(alatCount[0].total_stok) || 0,
        total_user_penyewa: userCount[0].count || 0,
        total_penyewaan: rentalCount[0].count || 0,
        total_penyewaan_menunggu: waitingCount[0].count || 0,
        total_alat_sedang_disewa: rentedCount[0].count || 0,
        total_pembayaran_lunas: paymentCount[0].count || 0,
        total_pendapatan: parseFloat(revenueCount[0].count) || 0,
        total_denda: parseFloat(fineCount[0].count) || 0
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = DashboardController;

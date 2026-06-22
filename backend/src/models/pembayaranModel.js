const db = require('../config/database');

const PembayaranModel = {
  createPayment: async ({ id_penyewaan, metode_pembayaran, jumlah_bayar, status_pembayaran, tanggal_bayar, bukti_pembayaran }) => {
    const [result] = await db.query(
      `INSERT INTO pembayaran (id_penyewaan, metode_pembayaran, jumlah_bayar, status_pembayaran, tanggal_bayar, bukti_pembayaran) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_penyewaan, metode_pembayaran, jumlah_bayar, status_pembayaran || 'menunggu_verifikasi', tanggal_bayar, bukti_pembayaran || null]
    );
    return result.insertId;
  },

  getAll: async () => {
    const query = `
      SELECT pem.*, pen.tanggal_sewa, pen.tanggal_kembali, pen.total_harga, u.nama AS nama_penyewa, u.email 
      FROM pembayaran pem
      JOIN penyewaan pen ON pem.id_penyewaan = pen.id_penyewaan
      JOIN users u ON pen.id_user = u.id_user
      ORDER BY pem.id_pembayaran DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getByUser: async (id_user) => {
    const query = `
      SELECT pem.*, pen.tanggal_sewa, pen.tanggal_kembali, pen.total_harga 
      FROM pembayaran pem
      JOIN penyewaan pen ON pem.id_penyewaan = pen.id_penyewaan
      WHERE pen.id_user = ?
      ORDER BY pem.id_pembayaran DESC
    `;
    const [rows] = await db.query(query, [id_user]);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT pem.*, pen.tanggal_sewa, pen.tanggal_kembali, pen.total_harga, u.nama AS nama_penyewa, u.email, u.no_hp 
      FROM pembayaran pem
      JOIN penyewaan pen ON pem.id_penyewaan = pen.id_penyewaan
      JOIN users u ON pen.id_user = u.id_user
      WHERE pem.id_pembayaran = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  getByRentalId: async (rentalId) => {
    const [rows] = await db.query('SELECT * FROM pembayaran WHERE id_penyewaan = ?', [rentalId]);
    return rows[0];
  },

  updateStatus: async (id, status_pembayaran) => {
    const [result] = await db.query(
      'UPDATE pembayaran SET status_pembayaran = ? WHERE id_pembayaran = ?',
      [status_pembayaran, id]
    );
    return result.affectedRows > 0;
  },

  updatePayment: async (id, { metode_pembayaran, jumlah_bayar, status_pembayaran, tanggal_bayar, bukti_pembayaran }) => {
    let query = 'UPDATE pembayaran SET metode_pembayaran = ?, jumlah_bayar = ?, status_pembayaran = ?, tanggal_bayar = ?';
    const params = [metode_pembayaran, jumlah_bayar, status_pembayaran, tanggal_bayar];
    
    if (bukti_pembayaran) {
      query += ', bukti_pembayaran = ?';
      params.push(bukti_pembayaran);
    }
    
    query += ' WHERE id_pembayaran = ?';
    params.push(id);
    
    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }
};

module.exports = PembayaranModel;

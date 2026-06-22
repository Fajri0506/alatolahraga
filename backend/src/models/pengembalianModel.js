const db = require('../config/database');

const PengembalianModel = {
  createReturn: async ({ id_penyewaan, tanggal_dikembalikan, kondisi_kembali, denda, catatan }) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into pengembalian
      const [result] = await connection.query(
        `INSERT INTO pengembalian (id_penyewaan, tanggal_dikembalikan, kondisi_kembali, denda, catatan) 
         VALUES (?, ?, ?, ?, ?)`,
        [id_penyewaan, tanggal_dikembalikan, kondisi_kembali || 'baik', denda || 0, catatan || null]
      );
      const id_pengembalian = result.insertId;

      // 2. Update penyewaan status to 'selesai'
      await connection.query(
        "UPDATE penyewaan SET status = 'selesai' WHERE id_penyewaan = ?",
        [id_penyewaan]
      );

      // 3. Restore stock if condition is good ('baik')
      if (kondisi_kembali === 'baik') {
        const [details] = await connection.query(
          'SELECT id_alat, jumlah FROM detail_penyewaan WHERE id_penyewaan = ?',
          [id_penyewaan]
        );
        for (const item of details) {
          await connection.query(
            'UPDATE alat_olahraga SET stok = stok + ? WHERE id_alat = ?',
            [item.jumlah, item.id_alat]
          );
        }
      } else {
        // If condition is 'rusak' or 'hilang', update the status/kondisi in alat_olahraga table if needed
        // but do not restore the stock to the pool.
        // We can also flag the equipment status if needed.
        const [details] = await connection.query(
          'SELECT id_alat FROM detail_penyewaan WHERE id_penyewaan = ?',
          [id_penyewaan]
        );
        for (const item of details) {
          await connection.query(
            'UPDATE alat_olahraga SET kondisi = ? WHERE id_alat = ?',
            [kondisi_kembali, item.id_alat]
          );
        }
      }

      await connection.commit();
      return id_pengembalian;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getAll: async () => {
    const query = `
      SELECT p.*, pen.tanggal_sewa, pen.tanggal_kembali, u.nama AS nama_penyewa, u.email 
      FROM pengembalian p
      JOIN penyewaan pen ON p.id_penyewaan = pen.id_penyewaan
      JOIN users u ON pen.id_user = u.id_user
      ORDER BY p.id_pengembalian DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT p.*, pen.tanggal_sewa, pen.tanggal_kembali, pen.total_harga, u.nama AS nama_penyewa, u.email 
      FROM pengembalian p
      JOIN penyewaan pen ON p.id_penyewaan = pen.id_penyewaan
      JOIN users u ON pen.id_user = u.id_user
      WHERE p.id_pengembalian = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  getByRentalId: async (rentalId) => {
    const [rows] = await db.query('SELECT * FROM pengembalian WHERE id_penyewaan = ?', [rentalId]);
    return rows[0];
  }
};

module.exports = PengembalianModel;

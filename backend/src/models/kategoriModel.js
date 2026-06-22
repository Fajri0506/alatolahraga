const db = require('../config/database');

const KategoriModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM kategori_alat ORDER BY nama_kategori ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM kategori_alat WHERE id_kategori = ?', [id]);
    return rows[0];
  },

  create: async ({ nama_kategori, deskripsi }) => {
    const [result] = await db.query(
      'INSERT INTO kategori_alat (nama_kategori, deskripsi) VALUES (?, ?)',
      [nama_kategori, deskripsi]
    );
    return result.insertId;
  },

  update: async (id, { nama_kategori, deskripsi }) => {
    const [result] = await db.query(
      'UPDATE kategori_alat SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?',
      [nama_kategori, deskripsi, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM kategori_alat WHERE id_kategori = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = KategoriModel;

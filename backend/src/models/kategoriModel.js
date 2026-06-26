const db = require('../config/database');

const KategoriModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM kategori_alat ORDER BY nama_kategori ASC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM kategori_alat WHERE id_kategori = $1', [id]);
    return rows[0];
  },

  create: async ({ nama_kategori, deskripsi }) => {
    const [result] = await db.query(
      'INSERT INTO kategori_alat (nama_kategori, deskripsi) VALUES ($1, $2) RETURNING id_kategori',
      [nama_kategori, deskripsi || null]
    );
    return result[0]?.id_kategori;
  },

  update: async (id, { nama_kategori, deskripsi }) => {
    const [result] = await db.query('UPDATE kategori_alat SET nama_kategori = $1, deskripsi = $2 WHERE id_kategori = $3',
      [nama_kategori, deskripsi, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM kategori_alat WHERE id_kategori = $1', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = KategoriModel;

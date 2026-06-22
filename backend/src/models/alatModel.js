const db = require('../config/database');

const AlatModel = {
  getAll: async (search = '', id_kategori = null) => {
    let query = `
      SELECT a.*, k.nama_kategori 
      FROM alat_olahraga a 
      LEFT JOIN kategori_alat k ON a.id_kategori = k.id_kategori
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND a.nama_alat LIKE ?';
      params.push(`%${search}%`);
    }

    if (id_kategori) {
      query += ' AND a.id_kategori = ?';
      params.push(id_kategori);
    }

    query += ' ORDER BY a.id_alat DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT a.*, k.nama_kategori 
      FROM alat_olahraga a 
      LEFT JOIN kategori_alat k ON a.id_kategori = k.id_kategori
      WHERE a.id_alat = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  create: async ({ id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status }) => {
    const [result] = await db.query(
      `INSERT INTO alat_olahraga (id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_kategori || null, nama_alat, deskripsi || null, stok || 0, harga_sewa, kondisi || 'baik', foto || null, status || 'tersedia']
    );
    return result.insertId;
  },

  update: async (id, { id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status }) => {
    // If foto is not provided, don't overwrite the existing foto in DB
    let query = `
      UPDATE alat_olahraga 
      SET id_kategori = ?, nama_alat = ?, deskripsi = ?, stok = ?, harga_sewa = ?, kondisi = ?, status = ?
    `;
    const params = [id_kategori || null, nama_alat, deskripsi || null, stok, harga_sewa, kondisi, status];

    if (foto !== undefined) {
      query += ', foto = ?';
      params.push(foto);
    }

    query += ' WHERE id_alat = ?';
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM alat_olahraga WHERE id_alat = ?', [id]);
    return result.affectedRows > 0;
  },

  updateStok: async (id, qtyChange) => {
    const [result] = await db.query(
      'UPDATE alat_olahraga SET stok = stok + ? WHERE id_alat = ?',
      [qtyChange, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = AlatModel;

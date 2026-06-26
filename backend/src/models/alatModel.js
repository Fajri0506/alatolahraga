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
    let paramIndex = 1;

    if (search) {
      query += ` AND a.nama_alat LIKE $${paramIndex++}`;
      params.push(`%${search}%`);
    }

    if (id_kategori) {
      query += ` AND a.id_kategori = $${paramIndex++}`;
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
      WHERE a.id_alat = $1
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0];
  },

  create: async ({ id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status }) => {
    const [result] = await db.query(
      `INSERT INTO alat_olahraga (id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_alat`,
      [id_kategori || null, nama_alat, deskripsi || null, stok || 0, harga_sewa, kondisi || 'baik', foto || null, status || 'tersedia']
    );
    return result[0]?.id_alat;
  },

  update: async (id, { id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, foto, status }) => {
    // If foto is not provided, don't overwrite the existing foto in DB
    let query = `
      UPDATE alat_olahraga 
      SET id_kategori = $1, nama_alat = $2, deskripsi = $3, stok = $4, harga_sewa = $5, kondisi = $6, status = $7
    `;
    const params = [id_kategori || null, nama_alat, deskripsi || null, stok, harga_sewa, kondisi, status];
    let paramIndex = 8;

    if (foto !== undefined) {
      query += `, foto = $${paramIndex++}`;
      params.push(foto);
    }

    query += ` WHERE id_alat = $${paramIndex++}`;
    params.push(id);

    const [result] = await db.query(query, params);
    // Di PostgreSQL pg module, kalau menggunakan wrapper kita, jumlah affectedRows tidak selalu ada di `result`
    // Namun karena pg biasanya memiliki property rowCount, kita butuh menyesuaikannya atau asumsi sukses 
    // jika query berhasil dijalankan tanpa error. 
    return true; 
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM alat_olahraga WHERE id_alat = $1', [id]);
    return result.affectedRows > 0;
  },

  updateStok: async (id, qtyChange) => {
    const [result] = await db.query('UPDATE alat_olahraga SET stok = stok + $1 WHERE id_alat = $2',
      [qtyChange, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = AlatModel;

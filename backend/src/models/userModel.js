const db = require('../config/database');

const UserModel = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT id_user, nama, email, no_hp, alamat, role, created_at FROM users WHERE id_user = $1', [id]);
    return rows[0];
  },

  create: async (userData) => {
    const { nama, email, password, no_hp, alamat, role } = userData;
    const [result] = await db.query('INSERT INTO users (nama, email, password, no_hp, alamat, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_user',
      [nama, email, password, no_hp || null, alamat || null, role || 'penyewa']
    );
    // Di PostgreSQL dengan wrapper yang sudah dibuat, pg mengembalikan result di baris pertama
    return result[0]?.id_user;
  }
};

module.exports = UserModel;

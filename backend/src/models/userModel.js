const db = require('../config/database');

const UserModel = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT id_user, nama, email, no_hp, alamat, role, created_at FROM users WHERE id_user = ?', [id]);
    return rows[0];
  },

  create: async (userData) => {
    const { nama, email, password, no_hp, alamat, role } = userData;
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, no_hp, alamat, role) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, email, password, no_hp || null, alamat || null, role || 'penyewa']
    );
    return result.insertId;
  }
};

module.exports = UserModel;

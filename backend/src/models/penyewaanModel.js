const db = require('../config/database');

const PenyewaanModel = {
  createRental: async (id_user, { tanggal_sewa, tanggal_kembali, total_harga, catatan, items }) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert into penyewaan
      const [rentalResult] = await connection.query(
        `INSERT INTO penyewaan (id_user, tanggal_sewa, tanggal_kembali, total_harga, status, catatan) 
         VALUES (?, ?, ?, ?, 'menunggu', ?)`,
        [id_user, tanggal_sewa, tanggal_kembali, total_harga, catatan || null]
      );
      const id_penyewaan = rentalResult.insertId;

      // 2. Insert into detail_penyewaan
      for (const item of items) {
        // Double check if tool exists and get its current price
        const [alatRows] = await connection.query(
          'SELECT harga_sewa, stok FROM alat_olahraga WHERE id_alat = ?',
          [item.id_alat]
        );
        if (alatRows.length === 0) {
          throw new Error(`Alat olahraga dengan ID ${item.id_alat} tidak ditemukan`);
        }
        const alat = alatRows[0];
        
        if (alat.stok < item.jumlah) {
          throw new Error(`Stok alat olahraga tidak mencukupi untuk item ID ${item.id_alat}`);
        }

        const subtotal = item.jumlah * alat.harga_sewa;

        await connection.query(
          `INSERT INTO detail_penyewaan (id_penyewaan, id_alat, jumlah, harga_sewa, subtotal) 
           VALUES (?, ?, ?, ?, ?)`,
          [id_penyewaan, item.id_alat, item.jumlah, alat.harga_sewa, subtotal]
        );
      }

      await connection.commit();
      return id_penyewaan;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getAll: async (status = null) => {
    let query = `
      SELECT p.*, u.nama, u.email, u.no_hp 
      FROM penyewaan p 
      JOIN users u ON p.id_user = u.id_user
    `;
    const params = [];

    if (status) {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.id_penyewaan DESC';
    const [rows] = await db.query(query, params);
    return rows;
  },

  getByUser: async (id_user) => {
    const query = `
      SELECT p.* 
      FROM penyewaan p 
      WHERE p.id_user = ? 
      ORDER BY p.id_penyewaan DESC
    `;
    const [rows] = await db.query(query, [id_user]);
    return rows;
  },

  getById: async (id) => {
    // 1. Get rental header
    const [headerRows] = await db.query(
      `SELECT p.*, u.nama, u.email, u.no_hp, u.alamat 
       FROM penyewaan p 
       JOIN users u ON p.id_user = u.id_user 
       WHERE p.id_penyewaan = ?`,
      [id]
    );

    if (headerRows.length === 0) return null;
    const rental = headerRows[0];

    // 2. Get rental details
    const [detailRows] = await db.query(
      `SELECT dp.*, ao.nama_alat, ao.foto 
       FROM detail_penyewaan dp 
       JOIN alat_olahraga ao ON dp.id_alat = ao.id_alat 
       WHERE dp.id_penyewaan = ?`,
      [id]
    );

    rental.items = detailRows;
    return rental;
  },

  updateStatus: async (id, newStatus) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get current rental status & details
      const [rentals] = await connection.query('SELECT status FROM penyewaan WHERE id_penyewaan = ?', [id]);
      if (rentals.length === 0) {
        throw new Error('Transaksi penyewaan tidak ditemukan');
      }
      const oldStatus = rentals[0].status;

      const [details] = await connection.query('SELECT id_alat, jumlah FROM detail_penyewaan WHERE id_penyewaan = ?', [id]);

      // Helper status checks
      const isApprovedOld = ['disetujui', 'sedang_disewa', 'selesai', 'terlambat'].includes(oldStatus);
      const isApprovedNew = ['disetujui', 'sedang_disewa', 'selesai', 'terlambat'].includes(newStatus);

      // Transition A: approved/active -> rejected/cancelled (return stock)
      if (isApprovedOld && !isApprovedNew) {
        for (const item of details) {
          await connection.query(
            'UPDATE alat_olahraga SET stok = stok + ? WHERE id_alat = ?',
            [item.jumlah, item.id_alat]
          );
        }
      }
      // Transition B: waiting/rejected -> approved/active (deduct stock)
      else if (!isApprovedOld && isApprovedNew) {
        for (const item of details) {
          // Check stock
          const [alat] = await connection.query('SELECT stok, nama_alat FROM alat_olahraga WHERE id_alat = ?', [item.id_alat]);
          if (alat[0].stok < item.jumlah) {
            throw new Error(`Stok untuk alat "${alat[0].nama_alat}" tidak mencukupi`);
          }
          await connection.query(
            'UPDATE alat_olahraga SET stok = stok - ? WHERE id_alat = ?',
            [item.jumlah, item.id_alat]
          );
        }
      }

      // 2. Update status in DB
      await connection.query('UPDATE penyewaan SET status = ? WHERE id_penyewaan = ?', [newStatus, id]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // If rental was active, restore stock before deleting
      const [rentals] = await connection.query('SELECT status FROM penyewaan WHERE id_penyewaan = ?', [id]);
      if (rentals.length > 0) {
        const status = rentals[0].status;
        const isApproved = ['disetujui', 'sedang_disewa', 'selesai', 'terlambat'].includes(status);
        
        if (isApproved) {
          const [details] = await connection.query('SELECT id_alat, jumlah FROM detail_penyewaan WHERE id_penyewaan = ?', [id]);
          for (const item of details) {
            await connection.query(
              'UPDATE alat_olahraga SET stok = stok + ? WHERE id_alat = ?',
              [item.jumlah, item.id_alat]
            );
          }
        }
      }

      const [result] = await connection.query('DELETE FROM penyewaan WHERE id_penyewaan = ?', [id]);
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = PenyewaanModel;

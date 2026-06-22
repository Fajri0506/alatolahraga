const KategoriModel = require('../models/kategoriModel');

const KategoriController = {
  getAllKategori: async (req, res, next) => {
    try {
      const categories = await KategoriModel.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  getKategoriById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await KategoriModel.getById(id);
      if (!category) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  createKategori: async (req, res, next) => {
    try {
      const { nama_kategori, deskripsi } = req.body;
      if (!nama_kategori) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi' });
      }
      const id = await KategoriModel.create({ nama_kategori, deskripsi });
      res.status(201).json({ message: 'Kategori berhasil dibuat', id_kategori: id });
    } catch (error) {
      next(error);
    }
  },

  updateKategori: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_kategori, deskripsi } = req.body;
      if (!nama_kategori) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi' });
      }
      const updated = await KategoriModel.update(id, { nama_kategori, deskripsi });
      if (!updated) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan atau tidak ada perubahan' });
      }
      res.status(200).json({ message: 'Kategori berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  },

  deleteKategori: async (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = await KategoriModel.delete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Kategori tidak ditemukan' });
      }
      res.status(200).json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = KategoriController;

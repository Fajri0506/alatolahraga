const AlatModel = require('../models/alatModel');
const path = require('path');

// Helper: generate unique filename from originalname (for memoryStorage)
const generateFilename = (file) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return uniqueSuffix + path.extname(file.originalname);
};

const AlatController = {
  getAllAlat: async (req, res, next) => {
    try {
      const { search, kategori } = req.query;
      const tools = await AlatModel.getAll(search, kategori);
      res.status(200).json(tools);
    } catch (error) {
      next(error);
    }
  },

  getAlatById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const tool = await AlatModel.getById(id);
      if (!tool) {
        return res.status(404).json({ message: 'Alat olahraga tidak ditemukan' });
      }
      res.status(200).json(tool);
    } catch (error) {
      next(error);
    }
  },

  createAlat: async (req, res, next) => {
    try {
      const { id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, status } = req.body;

      if (!nama_alat || !harga_sewa) {
        return res.status(400).json({ message: 'Nama alat dan harga sewa wajib diisi' });
      }

      // memoryStorage: no req.file.filename, generate one manually
      const foto = req.file ? generateFilename(req.file) : null;

      const newId = await AlatModel.create({
        id_kategori: id_kategori ? parseInt(id_kategori) : null,
        nama_alat,
        deskripsi,
        stok: stok ? parseInt(stok) : 0,
        harga_sewa: parseFloat(harga_sewa),
        kondisi,
        foto,
        status
      });

      res.status(201).json({
        message: 'Alat olahraga berhasil ditambahkan',
        id_alat: newId
      });
    } catch (error) {
      next(error);
    }
  },

  updateAlat: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id_kategori, nama_alat, deskripsi, stok, harga_sewa, kondisi, status } = req.body;

      if (!nama_alat || !harga_sewa) {
        return res.status(400).json({ message: 'Nama alat dan harga sewa wajib diisi' });
      }

      const currentTool = await AlatModel.getById(id);
      if (!currentTool) {
        return res.status(404).json({ message: 'Alat olahraga tidak ditemukan' });
      }

      // memoryStorage: generate filename if new file uploaded
      let foto = undefined;
      if (req.file) {
        foto = generateFilename(req.file);
      }

      const updated = await AlatModel.update(id, {
        id_kategori: id_kategori ? parseInt(id_kategori) : null,
        nama_alat,
        deskripsi,
        stok: stok ? parseInt(stok) : 0,
        harga_sewa: parseFloat(harga_sewa),
        kondisi,
        foto,
        status
      });

      if (!updated) {
        return res.status(400).json({ message: 'Gagal memperbarui alat olahraga' });
      }

      res.status(200).json({ message: 'Alat olahraga berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  },

  deleteAlat: async (req, res, next) => {
    try {
      const { id } = req.params;
      const tool = await AlatModel.getById(id);
      if (!tool) {
        return res.status(404).json({ message: 'Alat olahraga tidak ditemukan' });
      }

      await AlatModel.delete(id);
      res.status(200).json({ message: 'Alat olahraga berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AlatController;

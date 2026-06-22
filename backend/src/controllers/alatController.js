const AlatModel = require('../models/alatModel');
const path = require('path');
const fs = require('fs');

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

      // Handle photo upload name
      const foto = req.file ? req.file.filename : null;

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
      // If error occurs, cleanup uploaded file if exists
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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

      // Find current tool first to handle photo changes
      const currentTool = await AlatModel.getById(id);
      if (!currentTool) {
        return res.status(404).json({ message: 'Alat olahraga tidak ditemukan' });
      }

      let foto = undefined;
      if (req.file) {
        foto = req.file.filename;
        // Delete old photo if it exists
        if (currentTool.foto) {
          const oldPath = path.join(__dirname, '../uploads', currentTool.foto);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
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
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
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

      // Delete photo file from disk if exists
      if (tool.foto) {
        const filePath = path.join(__dirname, '../uploads', tool.foto);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await AlatModel.delete(id);
      res.status(200).json({ message: 'Alat olahraga berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AlatController;

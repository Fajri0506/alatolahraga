const express = require('express');
const router = express.Router();
const KategoriController = require('../controllers/kategoriController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', KategoriController.getAllKategori);
router.get('/:id', KategoriController.getKategoriById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, KategoriController.createKategori);
router.put('/:id', authMiddleware, adminMiddleware, KategoriController.updateKategori);
router.delete('/:id', authMiddleware, adminMiddleware, KategoriController.deleteKategori);

module.exports = router;

const express = require('express');
const router = express.Router();
const PembayaranController = require('../controllers/pembayaranController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Authenticated routes (pembayar)
router.post('/', authMiddleware, upload.single('bukti_pembayaran'), PembayaranController.createPembayaran);
router.get('/user', authMiddleware, PembayaranController.getUserPembayaran);
router.get('/:id', authMiddleware, PembayaranController.getPembayaranById);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, PembayaranController.getAllPembayaran);
router.put('/:id/status', authMiddleware, adminMiddleware, PembayaranController.verifikasiPembayaran);

module.exports = router;

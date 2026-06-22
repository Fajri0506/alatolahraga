const express = require('express');
const router = express.Router();
const PenyewaanController = require('../controllers/penyewaanController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Authenticated routes
router.post('/', authMiddleware, PenyewaanController.createPenyewaan);
router.get('/user', authMiddleware, PenyewaanController.getUserPenyewaan);
router.get('/:id', authMiddleware, PenyewaanController.getPenyewaanById);
router.delete('/:id', authMiddleware, PenyewaanController.deletePenyewaan);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, PenyewaanController.getAllPenyewaan);
router.put('/:id/status', authMiddleware, adminMiddleware, PenyewaanController.updateStatusPenyewaan);

module.exports = router;

const express = require('express');
const router = express.Router();
const PengembalianController = require('../controllers/pengembalianController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// User or admin can view a specific return they own/admin views all
router.get('/:id', authMiddleware, PengembalianController.getPengembalianById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, PengembalianController.createPengembalian);
router.get('/', authMiddleware, adminMiddleware, PengembalianController.getAllPengembalian);

module.exports = router;

const express = require('express');
const router = express.Router();
const AlatController = require('../controllers/alatController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', AlatController.getAllAlat);
router.get('/:id', AlatController.getAlatById);

// Admin-only routes with file upload support
router.post('/', authMiddleware, adminMiddleware, upload.single('foto'), AlatController.createAlat);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('foto'), AlatController.updateAlat);
router.delete('/:id', authMiddleware, adminMiddleware, AlatController.deleteAlat);

module.exports = router;

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyforrentalapp12345');
    req.user = decoded; // Contains id_user and role
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa' });
  }
};

module.exports = authMiddleware;

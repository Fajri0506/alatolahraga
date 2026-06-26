const multer = require('multer');
const path = require('path');

// Use memory storage for serverless compatibility (Netlify)
// File akan tersimpan di req.file.buffer
const storage = multer.memoryStorage();

// File Filter for Images Only
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const isMimeValid = allowedExtensions.test(file.mimetype);
  const isExtValid = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error('Hanya diperbolehkan mengunggah file gambar (jpg, jpeg, png, webp)!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit 5MB
});

module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/content');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Create a safe multer upload middleware that returns JSON errors
const createUploadMiddleware = () => {
  // Define the file filter
  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/html',
      'image/jpeg',
      'image/png',
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type: ' + file.mimetype), false);
    }
  };

  // Create the multer instance
  const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
    fileFilter: fileFilter
  });

  // Return a middleware function that wraps multer's array file upload
  return (fieldName) => {
    return (req, res, next) => {
      // Use multer's array file upload
      upload.array(fieldName)(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: 'File size cannot exceed 30MB' });
            }
            return res.status(400).json({ error: err.message });
          }
          // An unknown error occurred
          return res.status(500).json({ error: err.message });
        }
        
        next();
      });
    };
  };
};

module.exports = {
  uploadMiddleware: createUploadMiddleware()
};

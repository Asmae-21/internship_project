const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile');
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
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(null, false);
  };

  // Create the multer instance
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
  });

  // Return a middleware function that wraps multer's single file upload
  return (fieldName) => {
    return (req, res, next) => {
      // Use multer's single file upload
      upload.single(fieldName)(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: 'File size cannot exceed 5MB' });
            }
            return res.status(400).json({ error: err.message });
          }
          // An unknown error occurred
          return res.status(500).json({ error: err.message });
        }
        
        // Check if a file was provided but rejected by the filter
        if (req.file === undefined && req.body[fieldName] !== undefined) {
          return res.status(400).json({ 
            error: 'Only image files (jpeg, jpg, png, gif) are allowed!'
          });
        }
        
        next();
      });
    };
  };
};

module.exports = {
  uploadMiddleware: createUploadMiddleware()
};
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "complaints",
    format: async (req, file) => {
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      return file.mimetype.split('/')[1];
    },
    public_id: (req, file) => {
      const timestamp = Date.now();
      const fileName = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      return `complaint_${timestamp}_${fileName}`;
    },
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Configure multer with file size limits and filters
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  }
});

export default upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "complaints", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => {
      return `${Date.now()}-${file.originalname.split(" ").join("_")}`;
    },
  },
});

const upload = multer({ storage });

export default upload;

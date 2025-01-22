import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
// Configure Multer storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary
});

const parser = multer({ storage: storage });

export default parser;

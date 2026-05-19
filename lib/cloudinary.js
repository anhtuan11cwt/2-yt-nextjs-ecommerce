import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary SDK
cloudinary.config({
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
});

export default cloudinary;

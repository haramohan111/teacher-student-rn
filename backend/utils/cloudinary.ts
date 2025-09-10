import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Cloudinary ENV variables are missing");
}

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

export async function uploadImageToCloudinary(file: string) {
  return await cloudinary.uploader.upload(file, { folder: "teachers" });
}

export default cloudinary;
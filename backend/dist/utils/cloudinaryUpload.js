"use strict";
// utils/cloudinaryUpload.ts
// import cloudinary from "./cloudinary";
// import fs from "fs";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
// export const uploadImageToCloudinary = async (filePath: string) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       folder: "my_uploads", // optional: change to your folder
//     });
//     // Remove the local file after upload
//     fs.unlinkSync(filePath);
//     return result; // Cloudinary upload response (secure_url, public_id, etc.)
//   } catch (error) {
//     console.error("Cloudinary upload failed", error);
//     throw error;
//   }
// };
// utils/cloudinaryUpload.ts
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadImageToCloudinary = async (buffer, folder = "teachers") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder, upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        uploadStream.end(buffer);
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;

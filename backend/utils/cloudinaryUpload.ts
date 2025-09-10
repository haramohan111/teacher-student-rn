// utils/cloudinaryUpload.ts
// import cloudinary from "./cloudinary";
// import fs from "fs";

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
import cloudinary from "./cloudinary";
import fs from "fs";

export const uploadImageToCloudinary = async (
  buffer: Buffer,
  folder = "teachers"
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};



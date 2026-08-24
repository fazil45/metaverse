import cloudinary from "./cloudinary.js";
import { UploadApiOptions } from "cloudinary";

/**
 * Uploads a buffer (e.g. req.file.buffer from multer) to Cloudinary
 * and resolves with the resulting secure_url.
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  options: UploadApiOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "maps/tilesets",
        ...options,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload returned no result"));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
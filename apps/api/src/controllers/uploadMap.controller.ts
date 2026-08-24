import { Request, Response } from "express";
import { uploadBufferToCloudinary } from "../services/upload.service.js";
import { errorHandler } from "../utils/ErrorHandler.js"; // adjust to your actual path

export const uploadMapFiles = async (req: Request, res: Response) => {
  try {
    const files = req.files as {
      tileset?: Express.Multer.File[];
      tiledJson?: Express.Multer.File[];
    };

    const tilesetFile = files.tileset?.[0];
    const tiledJsonFile = files.tiledJson?.[0];

    if (!tilesetFile) {
      return res.status(400).json({ success: false, errorMessage: "Tileset image is required" });
    }

    // Image goes to Cloudinary
    const tilesetImageUrl = await uploadBufferToCloudinary(tilesetFile.buffer, {
      public_id: tilesetFile.originalname.replace(/\.[^/.]+$/, ""), // strip extension
    });

    // JSON also goes to Cloudinary — as a raw resource, since it's not an image
    let tiledJsonUrl: string | undefined;
    if (tiledJsonFile) {
      tiledJsonUrl = await uploadBufferToCloudinary(tiledJsonFile.buffer, {
        resource_type: "raw",
        folder: "maps/tiled-json",
        public_id: tiledJsonFile.originalname.replace(/\.[^/.]+$/, ""),
      });
    }

    res.status(200).json({
      success: true,
      tilesetImageUrl,
      tiledJsonUrl, // store this URL on the Map row — no JSON parsing or DB storage needed
    });
  } catch (error) {
    errorHandler({ error, res });
  }
};
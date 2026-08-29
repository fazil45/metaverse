  import { Request, Response } from "express";
  import { uploadBufferToCloudinary } from "../services/upload.service.js";
  import { errorHandler } from "../utils/ErrorHandler.js";
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

      const tilesetImageUrl = await uploadBufferToCloudinary(tilesetFile.buffer, {
        public_id: tilesetFile.originalname.replace(/\.[^/.]+$/, ""), 
      });

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
        tiledJsonUrl, 
      });
    } catch (error) {
      errorHandler({ error, res });
    }
  };
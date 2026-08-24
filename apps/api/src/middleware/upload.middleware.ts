import multer from "multer";
import type { RequestHandler } from "express";

// memoryStorage keeps the file as a Buffer on req.files — nothing touches disk
const storage = multer.memoryStorage();

export const mapUploadMiddleware: RequestHandler = multer({ storage }).fields([
  { name: "tileset", maxCount: 1 },
  { name: "tiledJson", maxCount: 1 },
]);
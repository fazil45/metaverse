import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
  createAvatar,
  createElement,
  createMap,
  updateElement,
} from "../controllers/admin.controller.js";
import { uploadMapFiles } from "../controllers/uploadMap.controller.js";
import multer from "multer";
const router: Router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/upload",
  upload.fields([
    { name: "tileset", maxCount: 1 },
    { name: "tiledJson", maxCount: 1 },
  ]),
  uploadMapFiles,
);

router.post("/element", createElement);
router.put("/element/:elementId", updateElement);
router.post("/avatar", createAvatar);
router.post("/map", createMap);

export default router;

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
const router: Router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/element", createElement);
router.put("/element/:elementId", updateElement);
router.post("/avatar", createAvatar);
router.post("/upload", uploadMapFiles);
router.post("/map", createMap);

export default router;

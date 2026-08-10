import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
  createAvatar,
  createElement,
  createMap,
  updateElement,
} from "../controllers/admin.controller.js";
const router: Router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/element", createElement);
router.post("/element/:elementId", updateElement);
router.post("/avatar", createAvatar);
router.post("/map", createMap);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import {
  getAllAvatars,
  getAllElements,
  getUsersMetadata,
  updateUserMetadata,
} from "../controllers/users.controller.js";

const router: Router = Router();

router.get("/avatars", getAllAvatars);
router.get("/elements", getAllElements);
router.post("/metadata/bulk", authMiddleware, getUsersMetadata);
router.post("/metadata", authMiddleware, updateUserMetadata);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import {
  getAllAvatars,
  getAllElements,
  getAllMaps,
  getUsersMetadata,
  updateUserMetadata,
} from "../controllers/users.controller.js";

const router: Router = Router();

router.get("/avatars", getAllAvatars);
router.get("/elements", getAllElements);
router.get("/metadata/bulk", authMiddleware, getUsersMetadata);
router.post("/metadata", authMiddleware, updateUserMetadata);
router.get("/maps", authMiddleware, getAllMaps);

export default router;

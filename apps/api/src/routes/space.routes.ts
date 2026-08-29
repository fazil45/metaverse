import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import {
  addElementInSpace,
  createSpace,
  deleteElementInSpace,
  deleteSpace,
  getAllSpaces,
  getSpace,
} from "../controllers/space.controller.js";
const router: Router = Router();

router.post("/create", authMiddleware, createSpace);
router.get("/all", authMiddleware, getAllSpaces);
router.delete("/:spaceId", authMiddleware, deleteSpace);
router.get("/:spaceId", authMiddleware, getSpace);
router.post("/element", authMiddleware, addElementInSpace);
router.delete("/element", authMiddleware, deleteElementInSpace);

export default router;

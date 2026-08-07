import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middlware.js";
import { createSpace } from "../controllers/space.controller.js";
const router: Router = Router();

router.post("/space",authMiddleware,createSpace);
router.post("/space/:spaceId");
router.get("/space/all");
router.get("/:spaceId");
router.get("/element");
router.post("/element");
router.delete("/element");

export default router;

import { Router } from "express";
const router: Router = Router();

router.post("/space");
router.post("/space/:spaceId");
router.get("/space/all");
router.get("/:spaceId");
router.get("/element");
router.post("/element");
router.delete("/element");

export default router;

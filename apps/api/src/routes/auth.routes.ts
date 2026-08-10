import { Router } from "express";
import { me, signin, signout, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middlware.js";

const router: Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", authMiddleware, me);
router.post("/signout", authMiddleware, signout);

export default router;

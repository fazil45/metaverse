import { Router } from "express";
import { me, signin, signout, signup} from "../../controllers/auth/auth.controller.js";

const router:Router = Router()

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/me",me)
router.post("/signout",signout)


export default router;
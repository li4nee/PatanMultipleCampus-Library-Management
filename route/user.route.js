import Router from "express";
import { loginUser,logoutUser,showUserProfile,signupUser } from "../controller/user.controller.js";
import { validateRegistration } from "../middleware/validator.middleware.js";
import { checkTokenMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/login",loginUser);
router.post("/signup",validateRegistration,signupUser);
router.get("/logout",logoutUser);
router.get("/profile/:_id",checkTokenMiddleware,showUserProfile);

export default router;

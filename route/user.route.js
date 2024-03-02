import Router from "express";
import { loginUser,logoutUser,showUserProfile,signupUser } from "../controller/user.controller.js";
import { validateRegistration } from "../middleware/validator.middleware.js";
const router = Router();

router.post("/login",loginUser);
router.post("/signup",validateRegistration,signupUser);
router.get("/logout",logoutUser);
router.get("/profile/:_id",showUserProfile);

export default router;

import Router from "express";
import { loginUser,logoutUser,seeTransactionDetail,showUserProfile,signupUser ,seeTransactionHistory} from "../controller/user.controller.js";
import { validateRegistration } from "../middleware/validator.middleware.js";
import { checkTokenMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/login",loginUser);
router.post("/signup",validateRegistration,signupUser);
router.get("/logout",checkTokenMiddleware,logoutUser);
router.get("/profile",checkTokenMiddleware,showUserProfile);
router.get("/transactionDetail/:transactionToken",checkTokenMiddleware,seeTransactionDetail);
router.get("/transactionHistory",checkTokenMiddleware,seeTransactionHistory);
export default router;

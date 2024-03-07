import Router from "express";
import {
  addBook,
  showAllBook,
  borrowBook,
  findBorrowTransaction,returnBook
} from "../controller/book.controller.js";
import { checkTokenMiddleware } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", showAllBook);
router.post("/addBook", checkTokenMiddleware, addBook);
router.get("/borrow/:ISBN", checkTokenMiddleware, borrowBook);
router.post(
  "/findBorrowTransaction",
  checkTokenMiddleware,
  findBorrowTransaction
);
router.get("/return/:bookId",checkTokenMiddleware,returnBook)
export default router;

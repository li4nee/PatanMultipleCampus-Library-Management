import Router from "express";
import { addBook, showAllBook } from "../controller/book.controller.js";
const router = Router();

router.get("/", showAllBook);
router.post("/addBook", addBook);

export default router;

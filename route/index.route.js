import Router from "express";
import Book from "../model/book.model.js";
const router = Router();

router.get("/",(req,res)=>{
res.send("ok");
})

export default router;
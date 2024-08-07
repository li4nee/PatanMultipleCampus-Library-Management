import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { upload } from "./middleware/multer.middleware.js";
import bookRouter from "./route/book.route.js";
import userRouter from "./route/user.route.js";
import { rateLimitMiddleware } from "./middleware/ratelimiter.middleware.js";
import cluster from "cluster";
import os from "os";
import cookieParser from "cookie-parser";
import Book from "./model/book.model.js";
import User from "./model/user.model.js";
import apiResponse from "./utils/apiresponse.js";
dotenv.config();

// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
// } else {
  const app = express();
  const port = process.env.PORT;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(rateLimitMiddleware);
  app.use(cookieParser());

  app.use("/home",async(req,res)=>{
    const users = await User.find({});
    const books = await Book.find({});
    let totalBooks= books.reduce((acc,elem)=>{ return acc+=elem.quantity},0)
   return res.json(new apiResponse(200,{totalUser:users.length,totalBooks},"Success!"))
  })

  app.use('/book', bookRouter);
  app.use('/user', userRouter);

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    }
    console.log("Server started!")
  });
  
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Db connected !!")
    })
    .catch((err) => {
      console.error(err);
    });  
// }
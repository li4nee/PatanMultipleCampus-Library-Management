import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { upload } from "./middleware/multer.middleware.js";
import indexRouter from "./route/index.route.js";
import bookRouter from "./route/book.route.js";
import userRouter from "./route/user.route.js";
import { rateLimitMiddleware } from "./middleware/ratelimiter.middleware.js";
import cluster from "cluster";
import os from "os";
dotenv.config();

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  const app = express();
  const port = process.env.PORT;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(rateLimitMiddleware);

  app.use('/', indexRouter);
  app.use('/book', bookRouter);
  app.use('/user', userRouter);

  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    }
  });
  
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });  
}
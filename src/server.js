import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  unauthorizedErrorHandler,
  badRequestHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import blogPostRouter from "./api/blogPost/index.js";
import commentRouter from "./api/comments/index.js";
import authoorsRouter from "./api/authors/index.js";
import userRouter from "./api/user/index.js";
const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());
server.use("/blogs", blogPostRouter);
server.use("/users", userRouter);

server.use("/authors", authoorsRouter); // author)
//server.use("/blogs/:blogPostId/comments", commentRouter);

server.use(unauthorizedErrorHandler);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});

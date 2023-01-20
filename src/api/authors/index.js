import express from "express";
import createHttpError from "http-errors";
import AuthorsModel from "./model.js";
import CommentModel from "../comments/model.js";
import mongoose from "mongoose";
const authoorsRouter = express.Router();

authoorsRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await AuthorsModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

authoorsRouter.post("/", async (req, res, next) => {
  try {
    console.log("POST");
    const newBlogPost = new AuthorsModel(req.body);
    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
authoorsRouter.get("/:authorsId", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorsId);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.authorsId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

authoorsRouter.put("/:authorsId", async (req, res, next) => {
  try {
    const updateAuthors = await AuthorsModel.findByIdAndUpdate(
      req.params.authorsId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateAuthors) {
      res.send(updateAuthors);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.authorsId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

authoorsRouter.delete("/:authorsId", async (req, res, next) => {
  try {
    const deleteAuthors = await AuthorsModel.findByIdAndDelete(
      req.params.authorsId
    );
    if (deleteAuthors) {
      res.status(204).send("deleted");
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.authorsId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default authoorsRouter;

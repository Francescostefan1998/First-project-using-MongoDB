import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import CommentModel from "../comments/model.js";
import mongoose from "mongoose";
const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await UsersModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    console.log("POST");
    const newBlogPost = new UsersModel(req.body);
    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      res.send(author);
    } else {
      next(
        createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const updateAuthors = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateAuthors) {
      res.send(updateAuthors);
    } else {
      next(
        createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deleteUser = await UsersModel.findByIdAndDelete(req.params.userId);
    if (deleteUser) {
      res.status(204).send("deleted");
    } else {
      next(
        createHttpError(404, `BlogPost wit id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;

import express from "express";
import createHttpError from "http-errors";
import BlogModel from "./model.js";
const blogPostRouter = express.Router();

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await BlogModel.find();
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = new BlogModel(req.body);
    const { _id } = await newBlogPost.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
blogPostRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogModel.findById(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.blogPostId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await BlogModel.findByIdAndUpdate(
      req.params.blogPostId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedBlogPost) {
      res.send(updatedBlogPost);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.blogPostId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await BlogModel.findByIdAndDelete(
      req.params.blogPostId
    );
    if (deletedBlogPost) {
      res.status(204).send("deleted");
    } else {
      next(
        createHttpError(
          404,
          `BlogPost wit id ${req.params.blogPostId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRouter;

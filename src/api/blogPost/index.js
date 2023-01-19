import express from "express";
import createHttpError from "http-errors";
import BlogModel from "./model.js";
import CommentModel from "../comments/model.js";
import mongoose from "mongoose";
import q2m from "query-to-mongo";
const blogPostRouter = express.Router();

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { total, blogs } = await BlogModel.findBlogsWithAuthors(mongoQuery);
    res.send({
      links: mongoQuery.links("https://localhost:3001/blogs", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      blogs,
    });
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

blogPostRouter.post("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPost = await BlogModel.findById(req.params.blogPostId);
    if (blogPost) {
      const newComment = new CommentModel(req.body);
      const { _id } = await newComment.save();
      const updatedBlogPost = await BlogModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      );
      res.status(201).send({ _id });
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with Id ${req.params.blogPostId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
blogPostRouter.get("/:blogPostId/comments", async (req, res, next) => {
  try {
    const blogPost = await BlogModel.findById(req.params.blogPostId);
    if (blogPost) {
      res.send(blogPost.comments);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with Id ${req.params.blogPostId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
blogPostRouter.get(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await BlogModel.findById(req.params.blogPostId);
      if (blogPost) {
        console.log(blogPost);
        console.log(blogPost.comments[0]._id);
        console.log(blogPost.comments[0]._id.toString());
        const comment = blogPost.comments.find(
          (comment) => comment._id.toString() === req.params.commentId
        );
        console.log(comment);
        if (comment) {
          res.send(comment);
        } else {
          next(
            createHttpError(
              404,
              `Comment with Id ${req.params.commentId} not found`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `BlogPost with Id ${req.params.blogPostId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
blogPostRouter.put(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
      const blogPost = await BlogModel.findById(req.params.blogPostId);
      if (blogPost) {
        const index = blogPost.comments.findIndex(
          (comment) => comment._id.toString() === req.params.commentId
        );
        console.log(index);
        if (index !== -1) {
          blogPost.comments[index] = {
            ...blogPost.comments[index],
            ...req.body,
          };
          await blogPost.save();
          res.send(blogPost);
        } else {
          next(
            createHttpError(
              404,
              `comment with Id ${req.params.commentId} not found`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `BlogPost with Id ${req.params.blogPostId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
blogPostRouter.delete(
  "/:blogPostId/comments/:commentId",
  async (req, res, next) => {
    try {
      console.log("delete triggered");
      const updatedBlogPost = await BlogModel.findByIdAndUpdate(
        req.params.blogPostId,
        {
          $pull: {
            comments: { _id: mongoose.Types.ObjectId(req.params.commentId) },
          },
        },
        { new: true }
      );

      if (updatedBlogPost) {
        res.send(updatedBlogPost);
      } else {
        next(
          createHttpError(
            404,
            `BlogPost with Id ${req.params.blogPostId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogModel.findById(req.params.blogPostId).populate({
      path: "authors",
      select: "firstName lastName",
    });
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

export default blogPostRouter;

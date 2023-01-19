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

userRouter.post("/:userId/comments", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      const newComment = new CommentModel(req.body);
      const { _id } = await newComment.save();
      const updateAuthors = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      );
      res.status(201).send({ _id });
    } else {
      next(
        createHttpError(404, `BlogPost with Id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId/comments", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      res.send(author.comments);
    } else {
      next(
        createHttpError(404, `BlogPost with Id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
userRouter.get("/:userId/comments/:commentId", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      console.log(author);
      console.log(author.comments[0]._id);
      console.log(author.comments[0]._id.toString());
      const comment = author.comments.find(
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
        createHttpError(404, `BlogPost with Id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
userRouter.put("/:userId/comments/:commentId", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.userId);
    if (author) {
      const index = author.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      console.log(index);
      if (index !== -1) {
        author.comments[index] = {
          ...author.comments[index],
          ...req.body,
        };
        await author.save();
        res.send(author);
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
        createHttpError(404, `BlogPost with Id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});
userRouter.delete("/:userId/comments/:commentId", async (req, res, next) => {
  try {
    console.log("delete triggered");
    const updateAuthors = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      {
        $pull: {
          comments: { _id: mongoose.Types.ObjectId(req.params.commentId) },
        },
      },
      { new: true }
    );

    if (updateAuthors) {
      res.send(updateAuthors);
    } else {
      next(
        createHttpError(404, `BlogPost with Id ${req.params.userId} not found`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;

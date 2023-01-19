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

authoorsRouter.post("/:authorsId/comments", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorsId);
    if (author) {
      const newComment = new CommentModel(req.body);
      const { _id } = await newComment.save();
      const updateAuthors = await AuthorsModel.findByIdAndUpdate(
        req.params.authorsId,
        { $push: { comments: newComment } },
        { new: true, runValidators: true }
      );
      res.status(201).send({ _id });
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with Id ${req.params.authorsId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
authoorsRouter.get("/:authorsId/comments", async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorsId);
    if (author) {
      res.send(author.comments);
    } else {
      next(
        createHttpError(
          404,
          `BlogPost with Id ${req.params.authorsId} not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
authoorsRouter.get(
  "/:authorsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const author = await AuthorsModel.findById(req.params.authorsId);
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
          createHttpError(
            404,
            `BlogPost with Id ${req.params.authorsId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
authoorsRouter.put(
  "/:authorsId/comments/:commentId",
  async (req, res, next) => {
    try {
      const author = await AuthorsModel.findById(req.params.authorsId);
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
          createHttpError(
            404,
            `BlogPost with Id ${req.params.authorsId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
authoorsRouter.delete(
  "/:authorsId/comments/:commentId",
  async (req, res, next) => {
    try {
      console.log("delete triggered");
      const updateAuthors = await AuthorsModel.findByIdAndUpdate(
        req.params.authorsId,
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
          createHttpError(
            404,
            `BlogPost with Id ${req.params.authorsId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default authoorsRouter;

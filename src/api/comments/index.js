import express from "express";
import q2m from "query-to-mongo";
import CommentModel from "./model.js";

const commentRouter = express.Router();

commentRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await CommentModel.countDocuments(mongoQuery.criteria);
    const comments = await CommentModel.find(
      mongoQuery.criteria,
      mongoQuery.criteria.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);

    res.send({
      links: mongoQuery.links(
        "http://localhost:3001/blogs/:blogsPostId/comments",
        total
      ),
      totalpages: Math.ceil(total / mongoQuery.options.limit),
      comments,
    });
  } catch (error) {
    next(error);
  }
});

export default commentRouter;

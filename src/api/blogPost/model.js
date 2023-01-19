import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: Number, required: true },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],

    content: { type: String, required: true },
    comments: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

blogSchema.static("findBlogsWithAuthors", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const blogs = await this.find(query.criteria, query.criteria.fields)
    .limit(query.options.limit)
    .skip(query.options.skip)
    .sort(query.options.sort)
    .populate({
      path: "authors like",
      select: "firstName lastName",
    });

  return { total, blogs };
});

export default model("Blog", blogSchema);

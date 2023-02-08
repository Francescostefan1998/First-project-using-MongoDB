import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    asin: { type: String, required: true },
    title: { type: String, required: true },
    rate: { type: Number, required: true },
    name: { type: String, required: true },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);

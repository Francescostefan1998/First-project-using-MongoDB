import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    asin: { type: String, required: true },
    title: { type: String, required: true },
    rate: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);

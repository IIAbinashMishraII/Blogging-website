const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 160,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      required: true,
      minlength: 200,
      maxlength: 2000000,
    },
    excerpt: {
      type: String,
      required: true,
    },
    mtitle: {
      type: String,
      required: true,
    },
    mdesc: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [
      { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tags", required: true }],
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);

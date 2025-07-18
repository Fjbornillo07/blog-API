// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔁 Virtual field for related comments
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

postSchema.set("toObject", { virtuals: true });
postSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", postSchema);

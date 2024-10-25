const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  file: { type: mongoose.Types.ObjectId, ref: "File" },
  category: { type: mongoose.Types.ObjectId, ref: "category", required: true },
  updatedBy: { type: mongoose.Types.ObjectId, ref: "user", required: true }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
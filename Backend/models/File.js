const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  key: { type: String, required: true },
  size: Number,
  mimeType: String,
  createdBy: { type: mongoose.Types.ObjectId, ref: "user" }
}, { timestamps: true });

const File = mongoose.model("File", fileSchema);

module.exports = File;
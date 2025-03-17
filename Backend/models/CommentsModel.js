const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    canvasId: { type: mongoose.Schema.Types.ObjectId, ref: "Canvas" },
    userEmail: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

commentSchema.statics.createComment = async function (
  canvasId,
  userEmail,
  content
) {
  const comment = await this.create({ canvasId, userEmail, content });
  return comment;
};

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

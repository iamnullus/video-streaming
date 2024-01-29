const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

exports.Comment = mongoose.model("Comment", commentSchema);

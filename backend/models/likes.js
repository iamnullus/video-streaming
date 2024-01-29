const { Schema, default: mongoose } = require("mongoose");

const likesSchema = new Schema({
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
  isDislike: {
    type: Boolean,
    required: true,
    default: false,
  },
});

exports.Likes = mongoose.model("Like", likesSchema);

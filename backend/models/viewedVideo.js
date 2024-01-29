const { Schema, default: mongoose } = require("mongoose");

const viewedVideosSchema = new Schema({
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

  date: {
    type: Date,
    default: Date.now(),
  },
});

exports.ViewedVideo = mongoose.model("ViewedVideo", viewedVideosSchema);

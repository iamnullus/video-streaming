const { Schema, default: mongoose } = require("mongoose");
const { GenericProfilePhoto } = require("../constant/photo_constants");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    default: GenericProfilePhoto,
  },
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
});

exports.User = mongoose.model("User", userSchema);

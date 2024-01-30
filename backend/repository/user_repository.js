const { User } = require("../models/user");

class UserRepository {
  GetUserByIdIfExists = async (userId) => await User.findOne({ _id: userId });

  IncreaseFollowerCount = async (userId) =>
    await User.updateOne({ _id: userId }, { $inc: { followersCount: 1 } });

  DecreaseFollowerCount = async (userId) =>
    await User.updateOne({ _id: userId }, { $inc: { followersCount: -1 } });

  IncreaseFollowingCount = async (userId) =>
    await User.updateOne({ _id: userId }, { $inc: { followingCount: 1 } });

  DecreaseFollowingCount = async (userId) =>
    await User.updateOne({ _id: userId }, { $inc: { followingCount: -1 } });
}

exports.UserRepository = UserRepository;

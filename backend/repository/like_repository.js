const { Likes } = require("../models/likes");

class LikeRepository {
  LikeVideo = async (userId, videoId) => {
    const like = await Likes.create({
      isDislike: false,
      userId: userId,
      videoId: videoId,
    });

    return like;
  };

  DislikeVideo = async (userId, videoId) => {
    const dislike = await Likes.create({
      isDislike: true,
      userId: userId,
      videoId: videoId,
    });

    return dislike;
  };

  DidUserLikeVideo = async (userId, videoId) => {
    const didUserLikeVideo = await Likes.findOne({
      userId: userId,
      videoId: videoId,
      isDislike: false,
    });

    if (didUserLikeVideo) return true;
    else return false;
  };

  DidUserDislikeVideo = async (userId, videoId) => {
    const didUserDislikeVideo = await Likes.findOne({
      userId: userId,
      videoId: videoId,
      isDislike: true,
    });

    if (didUserDislikeVideo) return true;
    else return false;
  };

  UnlikeVideo = async (userId, videoId) => {
    await Likes.deleteOne({
      isDislike: false,
      userId: userId,
      videoId: videoId,
    });
  };

  UnDislikeVideo = async (userId, videoId) => {
    await Likes.deleteOne({
      isDislike: true,
      userId: userId,
      videoId: videoId,
    });
  };

  GetUserLikedVideos = async (userId) => {
    const likes = await Likes.find({
      userId: userId,
      isDislike: false,
    }).populate("videoId");

    return likes.map((like) => like.videoId);
  };

  GetUserDislikeVideos = async (userId) => {
    const dislikes = await Likes.find({
      userId: userId,
      isDislike: true,
    }).populate("videoId");

    return dislikes.map((like) => like.videoId);
  };
}

exports.LikeRepository = LikeRepository;

const { Video } = require("../models/video");

class VideoRepository {
  GetVideoByIdIfExists = async (videoId) =>
    await Video.findOne({ _id: videoId });

  GetUserVideos = async (userId) => await Video.find({ userId: userId });

  IncreaseLikeCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { likeCount: 1 } });

  IncreaseDislikeCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { dislikeCount: 1 } });

  DecreaseLikeCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { likeCount: -1 } });

  DecreaseDislikeCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { dislikeCount: -1 } });

  IncreaseCommentCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { commentsCount: 1 } });

  DecreaseCommentCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { commentsCount: -1 } });

  IncreaseViewCount = async (videoId) =>
    await Video.updateOne({ _id: videoId }, { $inc: { viewCount: 1 } });
}

exports.VideoRepository = VideoRepository;

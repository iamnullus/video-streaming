const { ViewedVideo } = require("../models/viewedVideo");

class ViewedVideoRepository {
  ViewAVideo = async (userId, videoId) =>
    await ViewedVideo.create({
      userId: userId,
      videoId: videoId,
    });

  GetUserViewedVideos = async (userId) =>
    (await ViewedVideo.find({ userId }).populate("videoId")).map((vv) => ({
      videoId: vv.videoId,
      date: vv.date,
    }));

  GetUserVideoView = async (userId, videoId) =>
    await ViewedVideo.findOne({ userId, videoId }).sort({ date: -1 }).limit(1);
}

exports.ViewedVideoRepository = ViewedVideoRepository;

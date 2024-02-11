const { ViewedVideo } = require("../models/viewedVideo");

class ViewedVideoRepository {
  ViewAVideo = async (userId, videoId) =>
    await ViewedVideo.create({
      userId: userId,
      videoId: videoId,
    });

  GetUserViewedVideos = async (userId) =>
    (
      await ViewedVideo.find({ userId })
        .populate("videoId")
        .populate("userId")
        .sort({ date: -1 })
    ).map((vv) => ({
      video: vv.videoId,
      user: vv.userId,
      date: vv.date,
    }));

  GetUserVideoView = async (userId, videoId) =>
    await ViewedVideo.findOne({ userId, videoId }).sort({ date: -1 }).limit(1);
}

exports.ViewedVideoRepository = ViewedVideoRepository;

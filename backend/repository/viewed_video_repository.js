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
}

exports.ViewedVideoRepository = ViewedVideoRepository;

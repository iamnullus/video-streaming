const { Page, PageSize } = require("../constant/queryParamtersDefault");
const { Video } = require("../models/video");
const { UserRepository } = require("../repository/user_repository");
const { VideoRepository } = require("../repository/video_repository");
const { ValidationError, customError } = require("../util/custom_error");
const { getFilePath } = require("../util/file_path.js");
const fs = require("fs");
const { ResponseMessages } = require("../constant/responseMessages.js");
const { CommentRepository } = require("../repository/comment_repository.js");
const {
  ViewedVideoRepository,
} = require("../repository/viewed_video_repository.js");

var userRepository = new UserRepository();
var videoRepository = new VideoRepository();
var commentRespository = new CommentRepository();
var viewedVideoRepository = new ViewedVideoRepository();

exports.getUserViewedVideos = async (req, res, next) => {
  try {
    const userId = req.userId;

    let videosViewed = await viewedVideoRepository.GetUserViewedVideos(userId);

    const checkedUserAndVideos = [];

    videosViewed = videosViewed.filter((vv) => {
      if (
        !checkedUserAndVideos.some(
          (item) => item.user === vv.user.id && item.video === vv.video.id
        )
      ) {
        checkedUserAndVideos.push({
          user: vv.user.id,
          video: vv.video.id,
        });

        return true;
      }
      return false;
    });

    const videoDto = videosViewed.map((videoViewed) => ({
      id: videoViewed.video.id,
      title: videoViewed.video.title,
      thumbnail: videoViewed.video.thumbnailUrl,
      description: videoViewed.video.description,
      likeCount: videoViewed.video.likeCount,
      dislikeCount: videoViewed.video.dislikeCount,
      commentCount: videoViewed.video.commentCount,
      id: videoViewed.video.id,
      viewCount: videoViewed.video.viewCount,
      date: videoViewed.video.date,
      user: {
        id: videoViewed.user._id,
        name: videoViewed.user.name,
        followers: videoViewed.user.followersCount,
        profilePicture: videoViewed.user.profilePictureUrl,
      },
    }));

    res.status(200).send({ videos: videoDto });
  } catch (error) {
    next(error);
  }
};

exports.postUploadVideo = async (req, res, next) => {
  try {
    const valErr = ValidationError(req);
    if (valErr) {
      throw valErr;
    }

    const { title, description } = req.body;

    if (Object.keys(req.files).length < 2) {
      throw customError("missing files", 400);
    }

    const videoUrl = getFilePath(req.files.video[0]);
    const thumbnailUrl = getFilePath(req.files.thumbnail[0]);

    const video = Video.create({
      user: req.user,
      videoUrl,
      title,
      thumbnailUrl,
      description,
    });

    res.send({ msg: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound);
    }

    const videoPath = video.videoUrl;
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    next(error);
  }
};

exports.getVideoDetails = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    let video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError("Video not found");
    }

    video = await video.populate("user");

    const videoDetails = {
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnailUrl,
      description: video.description,
      likeCount: video.likeCount,
      dislikesCount: video.dislikeCount,
      commentCount: video.commentCount,
      id: video.id,
      viewCount: video.viewCount,
      date: video.date,
      user: {
        id: video.user._id,
        name: video.user.name,
        followers: video.user.followersCount,
        profilePicture: video.user.profilePictureUrl,
      },
    };

    res.status(200).send(videoDetails);
  } catch (error) {
    next(error);
  }
};

// this is expecting query parameters of it will default the default values
exports.getVideosWithPagination = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || Page;
    const pageSize = parseInt(req.query.pageSize) || PageSize;

    const lowerLimit = (page - 1) * pageSize;

    const videos = await Video.find()
      .populate("user")
      .skip(lowerLimit)
      .limit(pageSize);

    const videosDto = videos.map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail,
      likeCount: v.likeCount,
      dislikeCount: v.dislikeCount,
      user: {
        id: v.user._id,
        name: v.user.name,
        profilePicture: v.user.profilePictureUrl,
      },
      viewCount: v.viewCount,
      thumbnail: v.thumbnailUrl,
      date: v.date,
    }));

    res.json({
      videos: videosDto,
      page,
      pageSize,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserVideos = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = userRepository.GetUserByIdIfExists(userId);
    if (!user) {
      throw customError(ResponseMessages.userNotFound, 404);
    }

    const videos = await videoRepository.GetUserVideos(user._id);
    videos.sort();

    const videosDto = videos.map((v) => {
      return {
        id: v._id,
        title: v.title,
        thumbnail: v.thumbnailUrl,
        description: v.description,
        likeCount: v.likeCount,
        dislikeCount: v.dislikeCount,
        commentsCount: v.commentsCount,
        viewCount: v.viewCount,
        user: {
          id: v.user._id,
          name: v.user.name,
          profilePicture: v.user.profilePictureUrl,
        },
        date: v.date,
      };
    });

    res.status(200).send({ videos: videosDto });
  } catch (error) {
    next(error);
  }
};

exports.postCommentOnVideo = async (req, res, next) => {
  try {
    const validationError = ValidationError(req);
    if (validationError) {
      throw validationError;
    }

    const commentMessage = req.body.comment;
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    const comment = await commentRespository.CommentOnVideo(
      userId,
      videoId,
      commentMessage
    );
    if (!comment) {
      throw customError(ResponseMessages.CouldNotCommentOnVideo, 400);
    }

    await videoRepository.IncreaseCommentCount(videoId);

    res.status(200).send({
      msg: ResponseMessages.CommentedOnVideo,
      comment: {
        comment: comment.comment,
        userId: userId,
        videoId: videoId,
        id: comment._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.postDeleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const comment = await commentRespository.GetComment(commentId);
    if (!comment) {
      throw customError(ResponseMessages.CommentNotFound, 404);
    }

    if (
      !(await commentRespository.DidUserCommentOnVideo(
        req.userId,
        commentId,
        videoId
      ))
    ) {
      throw customError(ResponseMessages.NotUserComment, 401);
    }

    const deletedComment = await commentRespository.DeleteComment(commentId);
    if (!deletedComment) {
      throw customError(ResponseMessages.CouldNotDeleteComment, 400);
    }

    await videoRepository.DecreaseCommentCount(videoId);

    res.status(200).send({ msg: ResponseMessages.CommentDeleted });
  } catch (error) {
    next(error);
  }
};

exports.postUserAddView = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const videoView = await viewedVideoRepository.GetUserVideoView(
      req.userId,
      videoId
    );
    if (videoView) {
      const currentDate = new Date();
      const fiveMinutesAgo = new Date(currentDate - 5 * 60 * 1000);

      if (videoView.date > fiveMinutesAgo) {
        res.status(200).send({ msg: ResponseMessages.ViewedVideo });
        return;
      }
    }

    const viewed = await viewedVideoRepository.ViewAVideo(req.userId, videoId);
    console.log(viewed);
    if (!viewed) {
      throw customError(ResponseMessages.ViewingError, 500);
    }

    await videoRepository.IncreaseViewCount(videoId);

    res.status(200).send({ msg: ResponseMessages.ViewedVideo });
  } catch (error) {
    next(error);
  }
};

exports.postGuestAddView = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    await videoRepository.IncreaseViewCount(videoId);

    res.status(200).send(ResponseMessages.ViewedVideo);
  } catch (error) {
    next(error);
  }
};

exports.getVideoComments = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = await videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    let comments = await commentRespository.GetVideoComments(videoId);

    res.send({
      comments: comments.map((c) => ({
        id: c.id,
        text: c.comment,
        user: {
          id: c.userId.id,
          name: c.userId.name,
          profilePicture: c.userId.profilePictureUrl,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};

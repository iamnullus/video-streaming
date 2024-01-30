const { LikeRepository } = require("../repository/like_repository");
const { VideoRepository } = require("../repository/video_repository");
const { customError } = require("../util/custom_error");
const { ResponseMessages } = require("../constant/responseMessages.js");
const { FollowRepository } = require("../repository/follow_repository.js");
const { UserRepository } = require("../repository/user_repository.js");

const videoRepository = new VideoRepository();
const likeRepository = new LikeRepository();
const followRepository = new FollowRepository();
const userRepository = new UserRepository();

exports.postLikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    if (await likeRepository.DidUserLikeVideo(userId, videoId)) {
      throw customError(ResponseMessages.UserAlreadyLikedVideo, 400);
    }

    if (await likeRepository.DidUserDislikeVideo(userId, videoId)) {
      await likeRepository.UnDislikeVideo(userId, videoId);
      await videoRepository.DecreaseDislikeCount(videoId);
    }

    await likeRepository.LikeVideo(userId, videoId);
    await videoRepository.IncreaseLikeCount(videoId);

    res.status(200).send({ message: ResponseMessages.LikedVideo });
  } catch (error) {
    next(error);
  }
};

exports.postDislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    if (await likeRepository.DidUserDislikeVideo(userId, videoId)) {
      throw customError(ResponseMessages.UserAlreadyDislikedVideo, 404);
    }

    if (await likeRepository.DidUserLikeVideo(userId, videoId)) {
      await likeRepository.UnlikeVideo(userId, videoId);
      await videoRepository.DecreaseLikeCount(videoId);
    }

    await likeRepository.DislikeVideo(userId, videoId);
    await videoRepository.IncreaseDislikeCount(videoId);

    res.status(200).send({ message: ResponseMessages.DislikedVideo });
  } catch (error) {
    next(error);
  }
};

exports.getVideoLikeStatus = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    const isLiked = await likeRepository.DidUserLikeVideo(userId, videoId);
    const isDislike = await likeRepository.DidUserDislikeVideo(userId, videoId);

    res.status(200).send({ isDislike, isLiked });
  } catch (error) {
    next(error);
  }
};

exports.postUnlikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    if (!(await likeRepository.DidUserLikeVideo(userId, videoId))) {
      throw customError(ResponseMessages.DidNotLikeVideo);
    }

    await likeRepository.UnlikeVideo(userId, videoId);
    await videoRepository.DecreaseLikeCount(videoId);

    res.status(200).send({ message: ResponseMessages.UnlikeVideo });
  } catch (error) {
    next(error);
  }
};

exports.postUndislikeVideo = async (req, res, next) => {
  try {
    const videoId = req.params.videoId;

    const video = videoRepository.GetVideoByIdIfExists(videoId);
    if (!video) {
      throw customError(ResponseMessages.VideoNotFound, 404);
    }

    const userId = req.userId;

    if (!(await likeRepository.DidUserDislikeVideo(userId, videoId))) {
      throw customError(ResponseMessages.DidNotDislikeVideo);
    }

    await likeRepository.UnDislikeVideo(userId, videoId);
    await videoRepository.DecreaseDislikeCount(videoId);

    res.status(200).send({ message: ResponseMessages.UnlikeVideo });
  } catch (error) {
    next(error);
  }
};

exports.getUserLikedVideos = async (req, res, next) => {
  try {
    const userLikedVideos = await likeRepository.GetUserLikedVideos(req.userId);

    res.status(200).send(
      userLikedVideos.map((video) => ({
        title: video.title,
        thumbnail: video.thumbnailUrl,
        description: video.description,
        likeCount: video.likeCount,
        dislikesCount: video.dislikeCount,
        commentCount: video.commentCount,
        id: video.id,
      }))
    );
  } catch (error) {
    next(error);
  }
};

exports.getUserDislikedVideos = async (req, res, next) => {
  try {
    const userDislikedVideos = await likeRepository.GetUserDislikeVideos(
      req.userId
    );

    res.status(200).send(
      userDislikedVideos.map((video) => ({
        title: video.title,
        thumbnail: video.thumbnailUrl,
        description: video.description,
        likeCount: video.likeCount,
        dislikesCount: video.dislikeCount,
        commentCount: video.commentCount,
        id: video.id,
      }))
    );
  } catch (error) {
    next(error);
  }
};

exports.postUserFollower = async (req, res, next) => {
  try {
    const userId = req.userId;

    const followingId = req.params.followingId;

    if (userId == followingId) {
      throw customError(ResponseMessages.UserCannotFollowThemSelves, 409);
    }

    console.log(followingId);

    followingUser = await userRepository.GetUserByIdIfExists(followingId);
    if (!followingUser) {
      throw customError(ResponseMessages.UserNotFound, 404);
    }

    if (await followRepository.IsUserFollowing(userId, followingId)) {
      throw customError(ResponseMessages.UserAlreadyAFollower, 409);
    }

    const follow = await followRepository.AddFollow(userId, followingId);
    if (!follow) {
      throw customError(ResponseMessages.FollowError, 500);
    }

    await userRepository.IncreaseFollowerCount(followingId);
    await userRepository.IncreaseFollowingCount(userId);

    res.status(200).send({ msg: ResponseMessages.Followed });
  } catch (error) {
    next(error);
  }
};

exports.postUserUnfollow = async (req, res, next) => {
  try {
    const userId = req.userId;

    const followingId = req.params.followingId;

    if (userId == followingId) {
      throw customError(ResponseMessages.UserCannotUnfollowThemSelves, 409);
    }

    followingUser = await userRepository.GetUserByIdIfExists(followingId);
    if (!followingUser) {
      throw customError(ResponseMessages.UserNotFound, 404);
    }

    if (!(await followRepository.IsUserFollowing(userId, followingId))) {
      throw customError(ResponseMessages.UserNotAFollower, 409);
    }

    const unfollow = await followRepository.RemovingFollow(userId, followingId);
    if (!unfollow) {
      throw customError(ResponseMessages.UnfollowError, 500);
    }

    await userRepository.DecreaseFollowerCount(followingId);
    await userRepository.DecreaseFollowingCount(userId);

    res.status(200).send({ msg: ResponseMessages.Unfollowed });
  } catch (error) {
    next(error);
  }
};

exports.getUserdetails = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await userRepository.GetUserByIdIfExists(userId);
    if (!user) {
      throw customError(ResponseMessages.UserNotFound, 404);
    }

    res.send({
      user: {
        name: user.name,
        profilePictureUrl: user.profilePictureUrl,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

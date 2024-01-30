const { Comment } = require("../models/comment");
const { Likes } = require("../models/likes");

class CommentRepository {
  GetComment = async (commentId) => await Comment.findOne({ _id: commentId });
  CommentOnVideo = async (userId, videoId, commentMessage) =>
    await Comment.create({
      userId: userId,
      videoId: videoId,
      comment: commentMessage,
      // isReply: false,
    });

  DeleteComment = async (commentId) =>
    await Comment.deleteOne({ _id: commentId });

  GetUserCommentsVideos = async (userId) =>
    await Comment.findOne({ userId: userId }).populate("videoId");

  DidUserCommentOnVideo = async (userId, commentId, videoId) => {
    const comment = await Comment.findOne({
      userId: userId,
      _id: commentId,
      videoId: videoId,
    });

    if (comment) return true;
    else return false;
  };
}

exports.CommentRepository = CommentRepository;

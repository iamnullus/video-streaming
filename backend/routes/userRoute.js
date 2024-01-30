const { Router } = require("express");
const { body } = require("express-validator");

const userAuth = require("../middlewares/userAuth.js");
const userController = require("../controllers/userController.js");

const router = Router();

router.post("/like/video/:videoId", userAuth, userController.postLikeVideo);

router.post(
  "/dislike/video/:videoId",
  userAuth,
  userController.postDislikeVideo
);

router.get(
  "/video-likes-status/:videoId",
  userAuth,
  userController.getVideoLikeStatus
);

router.post("/unlike/:videoId", userAuth, userController.postUnlikeVideo);

router.post("/undislike/:videoId", userAuth, userController.postUndislikeVideo);

router.get("/liked-videos", userAuth, userController.getUserLikedVideos);

router.get("/disliked-videos", userAuth, userController.getUserDislikedVideos);

router.post("/follow/:followingId", userAuth, userController.postUserFollower);

router.post(
  "/unfollow/:followingId",
  userAuth,
  userController.postUserUnfollow
);

router.get("/details/:userId", userController.getUserdetails);

module.exports = router;

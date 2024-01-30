const { Router } = require("express");
const { body } = require("express-validator");
const {
  VideoSetup,
  ImageSetup,
  FileSetup,
} = require("../middlewares/multer_setup.js");

const videoController = require("../controllers/videoController.js");
const userAuth = require("../middlewares/userAuth.js");

const router = Router();

const multerImageUpload = ImageSetup("thumbnail");
const multerVideoUpload = VideoSetup("video");
const multerFileUpload = FileSetup("video", "thumbnail");

router.post(
  "/upload",
  multerFileUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  [body("title", "invalid title").notEmpty().trim()],
  userAuth,
  videoController.postUploadVideo
);

router.get("/details/:videoId", videoController.getVideoDetails);

// send in the user pagesize and page number in the query
router.get("/get/paginated", videoController.getVideosWithPagination);

router.get("/:videoId", videoController.getVideo);

router.get("/user/:userId", videoController.getUserVideos);

router.post(
  "/comment/:videoId",
  userAuth,
  body("comment").notEmpty().trim(),
  videoController.postCommentOnVideo
);

router.post(
  "/delete/comment/:commentId/:videoId",
  userAuth,
  videoController.postDeleteComment
);

router.post("/view/:videoId", userAuth, videoController.postUserAddView);

router.post("/guest/view/:videoId", userAuth, videoController.postGuestAddView);

module.exports = router;

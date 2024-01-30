const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { ImageMimeTypes, VideoMimeTypes } = require("../constant/mimeTypes");
const { customError } = require("../util/custom_error");

exports.ImageSetup = function (directory) {
  const fileFilter = (req, file, cb) => {
    if (ImageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(customError("invalid image type", 400), false);
    }
  };

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });

  return new multer({ storage: multerStorage, fileFilter });
};

exports.VideoSetup = function (directory) {
  const fileFilter = (req, file, cb) => {
    if (VideoMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(customError("invalid video type", 400), false);
    }
  };

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      cb(null, directory);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });

  return new multer({ storage: multerStorage, fileFilter });
};

exports.FileSetup = function (videoDirectory, imageDirectory) {
  const fileFilter = (req, file, cb) => {
    if (
      VideoMimeTypes.includes(file.mimetype) ||
      ImageMimeTypes.includes(file.mimetype)
    )
      cb(null, true);
    else {
      cb(customError("invalid file type", 400));
    }
  };

  const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (ImageMimeTypes.includes(file.mimetype)) {
        if (!fs.existsSync(imageDirectory)) {
          fs.mkdirSync(imageDirectory);
        }

        cb(null, imageDirectory);
      }
      if (VideoMimeTypes.includes(file.mimetype)) {
        if (!fs.existsSync(videoDirectory)) {
          fs.mkdirSync(videoDirectory);
        }

        cb(null, videoDirectory);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });

  return multer({ storage: multerStorage, fileFilter });
};

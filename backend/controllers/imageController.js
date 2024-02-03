const fs = require("fs");

exports.getImage = async (req, res, next) => {
  try {
    const imagePath = req.query.imagePath;

    const imageData = fs.readFileSync(imagePath);

    res.setHeader("Content-Type", "image/jpeg"); // Adjust for other image types
    res.send(imageData);
  } catch (error) {
    next(error);
  }
};

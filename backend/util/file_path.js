const path = require("path");

exports.getFilePath = function (file) {
  const relativeFilePath = file.path;
  const rootDirectory = path.resolve(__dirname, "../");
  return path.resolve(rootDirectory, path.resolve(relativeFilePath));
};

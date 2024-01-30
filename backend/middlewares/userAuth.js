const jwt = require("jsonwebtoken");
const { customError } = require("../util/custom_error.js");
const { User } = require("../models/user.js");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw customError("Authorization header not found", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw customError("token not found", 401);
    }

    let payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw newError("invalid auth token", 401);
    }

    const user = await User.findOne({ _id: payload.id });
    if (!user) {
      throw newError("User not found", 401);
    }

    req.userId = payload.id;
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

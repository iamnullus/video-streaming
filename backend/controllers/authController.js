const { User } = require("../models/user");
const { ValidationError, customError } = require("../util/custom_error");
const jwt = require("jsonwebtoken");
const { hash, verify } = require("argon2");
const { getFilePath } = require("../util/file_path");
const { ResponseMessages } = require("../constant/responseMessages");
require("dotenv").config();

function TokenSiginer(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      // expiresIn: "1h",
    }
  );
}

exports.postSignup = async (req, res, next) => {
  try {
    const valErr = ValidationError(req);
    if (valErr) {
      throw valErr;
    }

    const { name, password, email } = req.body;

    if (await User.findOne({ email })) {
      throw customError("Email already in use", 409);
    }

    const userCreateModel = {
      email,
      name,
    };

    if (req.file) {
      userCreateModel.profilePictureUrl = getFilePath(req.file);
    }

    userCreateModel.passwordHash = await hash(password);

    const user = await User.create(userCreateModel);

    const token = TokenSiginer(user);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw customError(ResponseMessages.UserNotFound, 404);
    }

    const comparePassword = await verify(user.passwordHash, password);
    if (!comparePassword) {
      throw customError("Incorrect password", 401);
    }

    const token = TokenSiginer(user);

    res.send({ token, userId: user.id });
  } catch (error) {
    next(error);
  }
};

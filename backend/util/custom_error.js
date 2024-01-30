const { validationResult } = require("express-validator");

exports.customError = (data, status) => {
  const err = new Error(data);
  err.status = status;
  return err;
};

exports.ValidationError = (req) => {
  const valErr = validationResult(req);
  if (!valErr.isEmpty()) {
    const err = new Error("validation error");
    err.status = 401;
    err.data = valErr.array();
    return err;
  }
  return null;
};

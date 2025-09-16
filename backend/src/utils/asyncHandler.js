const { ApiError } = require("./apiResponse");

function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (!(err instanceof ApiError)) {
        return next(new ApiError(500, err.message || "Internal Server Error"));
      }
      return next(err);
    });
  };
}


module.exports = { asyncHandler };

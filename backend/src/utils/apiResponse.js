function successResponse(
  res,
  statusCode = 200,
  message = "Success",
  data = {}
) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
}

class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode || 500;
    this.details = details;
  }
}

module.exports = { successResponse, ApiError };

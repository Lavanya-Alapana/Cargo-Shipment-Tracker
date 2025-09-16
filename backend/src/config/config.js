const dotenv = require("dotenv");
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URL: process.env.MONGODB_URL || "mongodb://localhost:27017/shipment-tracker",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  LOG_FILE_PATH: process.env.LOG_FILE_PATH || "./logs/app.log",
  AVG_SPEED: process.env.AVG_SPEED || 60,
};

module.exports = { ...config };

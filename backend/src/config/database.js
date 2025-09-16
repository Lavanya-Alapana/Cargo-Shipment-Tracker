const mongoose = require("mongoose");
const logger = require("../utils/logger");
const { MONGODB_URL, NODE_ENV } = require("./config");

const connectDB = async () => {
  try {
    // Print raw env variable
    console.log("Connecting to URI:", MONGODB_URL);

    await mongoose.connect(MONGODB_URL);

    console.log("MongoDB connected to host:", mongoose.connection.host);
    console.log("MongoDB connected to db:", mongoose.connection.name);

    logger.info(`MongoDB connected successfully (${NODE_ENV})`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

// Optional: handle disconnect/reconnect events
mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected!");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected!");
});

mongoose.connection.on("error", (err) => {
  logger.error(`MongoDB error: ${err.message}`, { stack: err.stack });
});

module.exports = connectDB;

const fs = require("fs");
const path = require("path");
const { LOG_LEVEL, LOG_FILE_PATH, NODE_ENV } = require("../config/config");

class Logger {
  constructor() {
    this.logDir = path.dirname(LOG_FILE_PATH);
    this.logLevel = LOG_LEVEL;
    this.nodeEnv = NODE_ENV;
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };
    return JSON.stringify(logEntry);
  }

  writeToFile(filename, message) {
    const logFile = path.join(this.logDir, filename);
    fs.appendFileSync(logFile, message + "\n");
  }

  info(message, meta = {}) {
    const formatted = this.formatMessage("INFO", message, meta);
    console.log(`[INFO] ${message}`, meta);
    this.writeToFile("app.log", formatted);
  }

  error(message, meta = {}) {
    const formatted = this.formatMessage("ERROR", message, meta);
    console.error(`[ERROR] ${message}`, meta);
    this.writeToFile("error.log", formatted);
  }

  warn(message, meta = {}) {
    const formatted = this.formatMessage("WARN", message, meta);
    console.warn(`[WARN] ${message}`, meta);
    this.writeToFile("app.log", formatted);
  }

  debug(message, meta = {}) {
    if (this.nodeEnv === "development") {
      const formatted = this.formatMessage("DEBUG", message, meta);
      console.debug(`[DEBUG] ${message}`, meta);
      this.writeToFile("debug.log", formatted);
    }
  }
}

module.exports = new Logger();

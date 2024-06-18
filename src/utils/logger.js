const winston = require("winston");
const config = require("../config/config")

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    http: 3,
    info: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "bold red",
    warning: "yellow",
    http: "magenta",
    info: "cyan",
    debug: "green",
  },
};

winston.addColors(customLevelsOptions.colors);

const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.simple(),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "./errors.log", level: "error" }),
  ]
});

function addLogger(req, res, next) {
  if (config.environment === 'production') {
    req.logger = prodLogger;
  } else {
    req.logger = devLogger;
  }

  next();
}


module.exports = { addLogger };

var winston = require("winston");
var path = require("path");

module.exports = function(filePath){
  var logger = new winston.Logger({
    level: 'info',
    transports: [
      new winston.transports.File({ 
        level: 'debug',
        filename: path.join(filePath, "Execution.log"),
        json: false,
        colorize: false
      }),
      new winston.transports.Console({
        level: 'info',
        json: false,
        colorize: true
      })
    ]
  });

  return logger;
};
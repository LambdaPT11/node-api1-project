const moment = require('moment');

// logger middleware
const logger = (req, res, next) => {
    console.log(`'LOG ENTERY: '${req.protocol}://${req.get('host')}${req.originalUrl}:${moment().format()}`);
    next();
};

module.exports = logger;
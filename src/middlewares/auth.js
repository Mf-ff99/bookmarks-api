const { API_TOKEN } = require('../../src/config/envConfig');
const logger = require('../../src/libs/logger');

// eslint-disable-next-line consistent-return
const authTokenCheck = (req, res, next) => {
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== API_TOKEN) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
};

module.exports = authTokenCheck;

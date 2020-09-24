const { NODE_ENV } = require('../../src/config/envConfig');

const errorTypes = {
  ValidationError: 422,
  UniqueViolationError: 409
};

const errorMessages = {
  UniqueViolationError: 'Already exists.'
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  const statusCode =
    res.statusCode === 200 ? errorTypes[error.name] || 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: errorMessages[error.name] || error.message,
    stack: NODE_ENV === 'production' ? '🥞' : error.stack,
    errors: error.errors || undefined
  });
};

module.exports = {
  notFound,
  errorHandler
};

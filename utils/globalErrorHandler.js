const AppError = require('../utils/appError');

const globalErrorHandler = (err, req, res, next) => {
  if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
    return next(new AppError('Email already exists. Please use a different email.', 400));
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.error('ERROR 💥:', err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};

module.exports = globalErrorHandler;
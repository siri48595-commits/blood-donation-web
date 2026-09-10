/**
 * Centralized error handling middleware
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found middleware
 */
export const notFoundMiddleware = (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};

export default errorMiddleware;

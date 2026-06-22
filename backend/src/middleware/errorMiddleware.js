const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal server';
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Only return stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorMiddleware;

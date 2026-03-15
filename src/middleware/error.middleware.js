/**
 * 404 handler
 */
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

/**
 * global error handler
 */
function errorHandler(err, req, res, next) {

  console.error(err)

  res.status(res.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  })
}

module.exports = {
  notFound,
  errorHandler
}
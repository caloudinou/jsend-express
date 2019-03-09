'use strict'

/**
 * MiddleWare error who use JSend-handler
 * this middleware it's would be to use in end workflow in express
 * @param {Object|undefined|null} err - instance of Error
 * @param {Object|undefined|null} req - request
 * @param {Object|undefined|null} res - response
 * @param {function} next - callback
 *
 * @author Pascal Naviere - caloudinou
 */
const middlewareErrorHandler = (err, req, res, next) => {
  !err && (err = {})
  const status = err.code || err.status || err.statusCode || 500
  const error = {
    message: err.message || err.name || 'error server'
  }
  if (err.errors || err.fields || err.contents) {
    error.errors = err.errors || err.fields || err.contents
  }
  res[/^4/.test(status) ? 'fail' : 'error']({ status, error })
}

module.exports = middlewareErrorHandler

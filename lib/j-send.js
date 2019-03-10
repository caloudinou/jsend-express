'use strict'

/**
 * @class
 * Simple API JSON Response Format
 * A JSend-compliant JSON Response Format for HTTP RESTful API
 * JSend standard & JSend-extend SAJ
 *
 * @author Pascal Naviere - caloudinou
 */
class JSend {
  /**
   * @constructor
   * @param {Object|null|undefined} parameters
   * @param {string} parameters.name - name of application
   * @param {string} parameters.version - version of application
   * @param {string} parameters.release - release of application
   */
  constructor (parameters) {
    const { name, version, release } = parameters || {}
    this._program = name || 'noname'
    this._version = version || '0.0.0'
    this._release = release || '0'
  }

  /**
   * Object to time description
   * @type {{datetime: string, timestamp: number}}
   * @return {{datetime: string, timestamp: number}}
   */
  get time () {
    const time = new Date()
    return {
      datetime: time.toISOString(),
      timestamp: time.getTime()
    }
  }

  /**
   * format response api to JSend
   * @param {{ data: Object|null }|{}} data
   * @param {{ paginationCount: string, paginationPage: string, paginationLimit: string }|{}} payload
   * @param {string} message - 'ok' or message error
   * @param {string} status - success | fail | error
   * @param {number} code - equal to status code http
   * @return {{program: string, version: string, release: string, datetime: string, timestamp: number, status: *, code: *, message: *}} - format response to JSend standard + ext. JSA
   */
  format (data, payload = {}, message, status, code) {
    const { datetime, timestamp } = this.time
    return {
      program: this._program,
      version: this._version,
      release: this._release,
      ...payload,
      datetime,
      timestamp,
      status,
      code,
      message,
      ...data
    }
  }

  /**
   * middleware to extend the res of Express
   * @param {Object} req - request express
   * @param {Object} res - response express
   * @param {function} next - callback express
   * @return void
   */
  middleware (req, res, next) {
    /**
     * send response
     * @param { Object | null | undefined } params
     * @param { number | undefined | null } params.status
     * @param { Object | null | undefined } params.data
     * @param { string | null | undefined } params.message
     * @return void
     */
    res.success = ({ status, data, message } = {}) => {
      res
        .status(status || 200)
        .json(this.format({ data: data || null }, {}, message || 'OK', 'success', status || 200))
    }
    /**
     * send a response with pagination
     * @param { Object | null | undefined } params
     * @param { number | undefined | null } params.status - status code http request
     * @param {{ paginationCount: string, paginationPage: string, paginationLimit: string }} params.payload
     * @param { Object | null | undefined } params.data
     * @param { string | null | undefined } params.message
     * @return void
     */
    res.partial = ({ status, payload, data, message } = {}) => {
      const { paginationCount, paginationPage, paginationLimit } = payload || {}
      res
        .set({
          'x-pagination-count': paginationCount,
          'x-pagination-page': paginationPage,
          'x-pagination-limit': paginationLimit
        })
        .status(status || 200)
        .json(this.format({ data: data || null }, payload, message || 'OK', 'success', status || 200))
    }
    /**
     * send error 4xx
     * @param { Object | null | undefined } params
     * @param {number|null|undefined} params.status - status code http request
     * @param {{ message, errors:[{key: string, value: string}]|string[]|string|number|undefined|null }} params.error -
     * @return void
     */
    res.fail = ({ status, error } = {}) => {
      const errors = error ? (error.errors || {}) : {}
      const data = Array.isArray(errors) && errors[0].key && errors[0].value
        ? errors.reduce((f, { key, value }) => { f[key] = value; return f }, {})
        : errors
      const message = error && error.message ? error.message : 'invalid request'
      const statusCode = /^4/.test(status) ? status : 400
      res
        .status(statusCode)
        .json(this.format({ data }, {}, message, 'fail', statusCode))
    }
    /**
     * send error 5xx
     * @param { Object | null | undefined } params
     * @param { number|undefined|null } params.status - status code http request
     * @param {{ message|undefined|null }} params.error -
     * @return void
     */
    res.error = ({ status, error } = {}) => {
      const statusCode = /^5/.test(status) ? status : 500
      const message = error && error.message ? error.message : 'error server'
      res
        .status(statusCode)
        .json(this.format({}, {}, message, 'error', statusCode))
    }
    next()
  }
}

module.exports = JSend

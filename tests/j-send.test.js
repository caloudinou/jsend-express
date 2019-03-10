'use strict'

const test = require('ava')
const { JSend } = require('./..')

/**
 * initialisation of JSend
 */
test('[jSend] check initialisation', t => {
  const jSend = new JSend()
  t.deepEqual(jSend._program, 'noname')
  t.deepEqual(jSend._version, '0.0.0')
  t.deepEqual(jSend._release, '0')
})

test('[jSend] check initialisation any parameters', t => {
  const jSend = new JSend()
  t.deepEqual(jSend._program, 'noname')
  t.deepEqual(jSend._version, '0.0.0')
  t.deepEqual(jSend._release, '0')
})

test('[jSend] check initialisation with a null at parameters', t => {
  const jSend = new JSend(null)
  t.deepEqual(jSend._program, 'noname')
  t.deepEqual(jSend._version, '0.0.0')
  t.deepEqual(jSend._release, '0')
})

test('[jSend] check initialisation with parameters', t => {
  const params = { name: 'check initialisation with parameters', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)
  t.deepEqual(jSend._program, params.name)
  t.deepEqual(jSend._version, params.version)
  t.deepEqual(jSend._release, params.release)
})

/**
 * use middleware of JSend
 */
test('[jSend] use middleware', t => {
  const params = { name: 'use middleware', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => fakeGlobalExpressObject.response.json,
      json: obj => {}
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware)

  t.deepEqual(Object.keys(fakeGlobalExpressObject.response).length, 6)
  const check = Object
    .entries(fakeGlobalExpressObject.response)
    .reduce((f, [props, values]) => {
      f[props] = typeof values
      return f
    }, {})
  t.deepEqual(check.fail, 'function')
  t.deepEqual(check.error, 'function')
  t.deepEqual(check.partial, 'function')
  t.deepEqual(check.success, 'function')
  t.deepEqual(check.status, 'function')
  t.deepEqual(check.json, 'function')
})

/**
 * use success of JSend
 */
test('[jSend] use success no param', t => {
  const params = { name: 'use success', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 200)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'success')
        t.deepEqual(obj.code, 200)
        t.deepEqual(obj.message, 'OK')
        t.deepEqual(obj.data, null)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.success()
})

test('[jSend] use success', t => {
  const params = { name: 'use success', version: '1.1.1', release: '42' }
  const message = 'TEST OK'
  const status = 201
  const data = {
    test: 'ok'
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 201)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'success')
        t.deepEqual(obj.code, 201)
        t.deepEqual(obj.message, message)
        t.deepEqual(obj.data.test, data.test)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))
  fakeGlobalExpressObject.response.success({ status, data, message })
})

/**
 * use partial of JSend
 */
test('[jSend] use partial no param', t => {
  const params = { name: 'use partial', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      set: obj => {
        t.deepEqual(Object.keys(obj).length, 3)
        t.deepEqual(obj['x-pagination-count'], undefined)
        t.deepEqual(obj['x-pagination-page'], undefined)
        t.deepEqual(obj['x-pagination-limit'], undefined)
        return fakeGlobalExpressObject.response
      },
      status: code => {
        t.deepEqual(code, 200)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'success')
        t.deepEqual(obj.code, 200)
        t.deepEqual(obj.message, 'OK')
        t.deepEqual(obj.data, null)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.partial()
})

test('[jSend] use partial', t => {
  const params = { name: 'use partial', version: '1.1.1', release: '42' }
  const payload = {
    paginationCount: 1,
    paginationPage: 5,
    paginationLimit: 20
  }
  const message = 'TEST OK'
  const status = 201
  const data = {
    test: 'ok'
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      set: obj => {
        t.deepEqual(Object.keys(obj).length, 3)
        t.deepEqual(obj['x-pagination-count'], payload.paginationCount)
        t.deepEqual(obj['x-pagination-page'], payload.paginationPage)
        t.deepEqual(obj['x-pagination-limit'], payload.paginationLimit)
        return fakeGlobalExpressObject.response
      },
      status: code => {
        t.deepEqual(code, 201)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, payload.paginationCount)
        t.deepEqual(obj.paginationPage, payload.paginationPage)
        t.deepEqual(obj.paginationLimit, payload.paginationLimit)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'success')
        t.deepEqual(obj.code, 201)
        t.deepEqual(obj.message, message)
        t.deepEqual(obj.data.test, data.test)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))
  fakeGlobalExpressObject.response.partial({ status, payload, data, message })
})

/**
 * use fail of JSend
 */
test('[jSend] use fail no param', t => {
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 400)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, 400)
        t.deepEqual(obj.message, 'invalid request')
        t.deepEqual(obj.data, {})
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail()
})

test('[jSend] use fail with a error equals string', t => {
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const status = 404
  const error = 'error test'
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, status)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, status)
        t.deepEqual(obj.message, 'invalid request')
        t.deepEqual(obj.data, {})
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail({ status, error })
})

test('[jSend] use fail with a error.erros equals string', t => {
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const status = 404
  const error = { errors: 'error test' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, status)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, status)
        t.deepEqual(obj.message, 'invalid request')
        t.deepEqual(obj.data, error.errors)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail({ status, error })
})

test('[jSend] use fail with a error.erros equals string[]', t => {
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const status = 404
  const error = { errors: ['error test 1', 'error test 2', 'error test 3'] }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, status)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, status)
        t.deepEqual(obj.message, 'invalid request')
        t.deepEqual(obj.data, error.errors)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail({ status, error })
})

test('[jSend] use fail with a error.erros equals [{ key: string, value: string }]', t => {
  t.plan(16)
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const status = 504
  const error = {
    errors: [
      { key: 'items1', value: 'it\'s required' },
      { key: 'items2', value: 'missing this field' },
      { key: 'items3', value: 'items3_required' }
    ]
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 400)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, 400)
        t.deepEqual(obj.message, 'invalid request')
        t.deepEqual(Object.keys(obj.data).length, error.errors.length)
        error.errors.forEach(({ key, value }) => {
          t.deepEqual(obj.data[key], value, key + ' ' + value)
        })
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail({ status, error })
})

test('[jSend] use fail with a error.message', t => {
  t.plan(13)
  const params = { name: 'use fail', version: '1.1.1', release: '42' }
  const status = 504
  const error = {
    message: 'test error'
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 400)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'fail')
        t.deepEqual(obj.code, 400)
        t.deepEqual(obj.message, error.message)
        t.deepEqual(obj.data, {})
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.fail({ status, error })
})

/**
 * use error of JSend
 */
test('[jSend] use error with any param', t => {
  t.plan(13)
  const params = { name: 'use error', version: '1.1.1', release: '42' }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 500)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'error')
        t.deepEqual(obj.code, 500)
        t.deepEqual(obj.message, 'error server')
        t.deepEqual(obj.data, undefined)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.error()
})

test('[jSend] use error with error.message', t => {
  t.plan(13)
  const params = { name: 'use error', version: '1.1.1', release: '42' }
  const status = 423
  const error = {
    message: 'test error'
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 500)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'error')
        t.deepEqual(obj.code, 500)
        t.deepEqual(obj.message, error.message)
        t.deepEqual(obj.data, undefined)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.error({ status, error })
})

test('[jSend] use error with status 512', t => {
  t.plan(13)
  const params = { name: 'use error', version: '1.1.1', release: '42' }
  const status = 512
  const error = {
    message: 'test error'
  }
  const jSend = new JSend(params)

  const fakeGlobalExpressObject = {
    request: {},
    response: {
      status: code => {
        t.deepEqual(code, 512)
        return fakeGlobalExpressObject.response
      },
      json: obj => {
        t.deepEqual(obj.program, params.name)
        t.deepEqual(obj.version, params.version)
        t.deepEqual(obj.paginationCount, undefined)
        t.deepEqual(obj.paginationPage, undefined)
        t.deepEqual(obj.paginationLimit, undefined)
        t.deepEqual(obj.datetime, new Date(obj.timestamp).toISOString())
        t.deepEqual(typeof obj.datetime, 'string')
        t.deepEqual(typeof obj.timestamp, 'number')
        t.deepEqual(obj.status, 'error')
        t.deepEqual(obj.code, 512)
        t.deepEqual(obj.message, error.message)
        t.deepEqual(obj.data, undefined)
      }
    },
    next: function () {}
  }
  const use = callback => {
    callback(
      fakeGlobalExpressObject.request,
      fakeGlobalExpressObject.response,
      fakeGlobalExpressObject.next
    )
  }

  use(jSend.middleware.bind(jSend))

  fakeGlobalExpressObject.response.error({ status, error })
})

/**
 * use format of JSend
 */
test('[jSend] use format launch 3rd', async t => {
  t.plan(1)
  const jSend = new JSend()
  const newTimeFormat = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(jSend.format().timestamp)
      }, 2000)
    })
  }

  const jSendFormatTime1 = await newTimeFormat()
  const jSendFormatTime2 = await newTimeFormat()
  const jSendFormatTime3 = await newTimeFormat()

  t.deepEqual(
    jSendFormatTime1 !== jSendFormatTime2 &&
    jSendFormatTime1 !== jSendFormatTime3 &&
    jSendFormatTime2 !== jSendFormatTime3,
    true
  )
})

'use strict'

const test = require('ava')
const { middlewareErrorHandler } = require('./..')

const error413 = {
  message: 'TEST INSERT ERROR HANDLER',
  code: 413,
  name: 'TEST',
  errors: ['TEST LIST']
}

class Error414 extends Error {
  constructor () {
    super('TEST INSERT ERROR HANDLER')
    this.statusCode = 414
    this.name = 'TEST'
    this.errors = ['TEST LIST']
  }
}

class Error415 extends Error {
  constructor () {
    super('TEST INSERT ERROR HANDLER')
    this.status = 415
    this.name = 'TEST'
    this.errors = ['TEST LIST']
  }
}

class Error416 extends Error {
  constructor () {
    super('TEST INSERT ERROR HANDLER')
    this.statusCode = 416
    this.message = null
    this.name = 'TEST'
    this.errors = ['TEST LIST']
  }
}

class Error442 extends Error {
  constructor () {
    super('TEST INSERT ERROR HANDLER')
    this.statusCode = 442
    this.message = null
    this.name = 'TEST'
    this.contents = ['TEST LIST']
  }
}

class Error512 extends Error {
  constructor () {
    super('erreur server test')
    this.code = 512
  }
}

class Error412 extends Error {
  constructor () {
    super('error 412')
    this.code = 412
    this.fields = [
      { key: 'foo1', value: 'foo1 required' },
      { key: 'foo2', value: 'foo2 required' }
    ]
  }
}

const errorBasic = new Error('__TATA__')

test('[error-handler] Error handler set with error code', t => {
  t.plan(2)
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, error413.code)
      t.deepEqual(error, { message: error413.message, errors: error413.errors })
    }
  }
  middlewareErrorHandler(error413, req, res, next)
})

test('[error-handler] Error handler set with error statusCode', t => {
  t.plan(2)
  const errorToTest = new Error414()
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, errorToTest.statusCode)
      t.deepEqual(error, { message: errorToTest.message, errors: errorToTest.errors })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with error status', t => {
  t.plan(2)
  const errorToTest = new Error415()
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, errorToTest.status)
      t.deepEqual(error, { message: errorToTest.message, errors: errorToTest.errors })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with error.fields', t => {
  t.plan(2)
  const errorToTest = new Error412()
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, errorToTest.code)
      t.deepEqual(error, { message: errorToTest.message, errors: errorToTest.fields })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with error.contents', t => {
  t.plan(2)
  const errorToTest = new Error442()
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, errorToTest.statusCode)
      t.deepEqual(error, { message: errorToTest.name, errors: errorToTest.contents })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with error name set null', t => {
  t.plan(2)
  const errorToTest = new Error416()
  const req = {}
  const next = () => {}
  const res = {
    fail: ({ status, error }) => {
      t.deepEqual(status, errorToTest.statusCode)
      t.deepEqual(error, { message: errorToTest.name, errors: errorToTest.errors })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with only code and message in construct error', t => {
  t.plan(2)
  const errorToTest = new Error512()
  const req = {}
  const next = () => {}
  const res = {
    error: ({ status, error }) => {
      t.deepEqual(status, errorToTest.code)
      t.deepEqual(error, { message: errorToTest.message })
    }
  }
  middlewareErrorHandler(errorToTest, req, res, next)
})

test('[error-handler] Error handler set with undefined', t => {
  t.plan(2)
  const req = {}
  const next = () => {}
  const res = {
    error: ({ status, error }) => {
      t.deepEqual(status, 500)
      t.deepEqual(error, { message: 'error server' })
    }
  }
  middlewareErrorHandler(undefined, req, res, next)
})

test('[error-handler] Error handler set with null', t => {
  t.plan(2)
  const req = {}
  const next = () => {}
  const res = {
    error: ({ status, error }) => {
      t.deepEqual(status, 500)
      t.deepEqual(error, { message: 'error server' })
    }
  }
  middlewareErrorHandler(null, req, res, next)
})

test('[error-handler] Error handler set with error basic', t => {
  t.plan(2)
  const req = {}
  const next = () => {}
  const res = {
    error: ({ status, error }) => {
      t.deepEqual(status, 500)
      t.deepEqual(error, { message: errorBasic.message })
    }
  }
  middlewareErrorHandler(errorBasic, req, res, next)
})

## jsend-express

#### install in your project
`npm i jsend-express --save`

#### About

JSend-express is a complete implement to standard JSend in expressJs and it's extension. It's Simple API JSON Response Format, a JSend-compliant JSON Response Format for HTTP RESTful API (JSend standard & JSend-extend SAJ).
JSend-express are no dependencies

#### Usage

To use the middleware you simply import the default JSend function. Then use it as you would any other expressJs middleware. This middleware adds a jsend object to the Express.js Response object. It has 4 functions: `success`, `partial`, `fail` and `error`. 

#### Why use JSend Api ?
...

JSONAPI vs RESTAPI vs JSEND

JSONAPI link: https://jsonapi.org/

RESTAPI link: https://github.com/cryptlex/rest-api-response-format

JSEND link: https://github.com/omniti-labs/jsend

JSEND extend link: https://technick.net/guides/software/software_json_api_format/



#### Initialization JSend
`JSend` must be `require` to same level as your expressJs application.

Just like `express`, it must be initialized by doing a`new JSend()`.

This object must be used with an object json content 3 properties `new JSend({name, version, release})` :

 - name: your application name
 - version: your application version 
 - release: you number of release or your last commit

Once `JSend` is initialized, its middleware is used to extend the response of `express` object with JSend Api methods:
 - `success`
 - `partial`
 - `fail`
 - `error` 

#### How use JSend-express
sample project example: https://github.com/caloudinou/sample-example-jsend-express

#### Example server.js
```js
/**
* require express is required
*/
const express = require('express')

/**
* init your app
*/
const app = express()



/**
* require JSend-express is required
*/
const { JSend } = require('jsend-express')

/**
 * init JSend
 * @type {JSend}
 */
const jSend = new JSend({ name: 'appName', version: 'X.X.X', release: 'XX' })

/**
 * use middleware JSend to extend express after init app and before your route
 * @description
 * add 
 * {{ success: function, fail: function, partial: function, error: function}} 
 * in response of express   
 */
app.use(jSend.middleware.bind(jSend))



// your route
// ...

```

#### use method JSend response in controller express
###### example success method
```js 
app.get('/', (req, res, next) => {
    const data = { example: 'example response success' }
    res.success({ data })
    // response HTTP / status 200
    // body:
    // {
    //      program: 'appName'
    //      version: '1.0.0'
    //      release: '42'
    //      datetime: '2019-03-10T16:50:38.546Z'
    //      timestamp: 1552236638546
    //      status: 'success'
    //      code: 200
    //      message: 'OK'
    //      data: { 
    //         example: 'example response success' 
    //      }
    // }
})
```


#### description of head JSend
...

#### description of body JSend
...

#### description of methods JSend
`success`: 
```js 
/**
 *   @description` success response HTTP to type 200 - 300
 *   @type function
 *   @param {{ 
 *        status: number | undefined, 
 *        data: Object | null,
 *        message: string | undefined
 *    } | undefined}
 *   @return {{
 *       program: string,
 *       version: string,
 *       release: string,
 *       datetime: string,
 *       timestamp: number,
 *       status: string,
 *       code: number,
 *       message: string,
 *       data: Object
 *   }}
 */
```
by default: 
 - `status` = 200
 - `message` = OK
 - `data` = null

###### example
```js 
app.get('/', (req, res, next) => {
    const status = 201
    const message = 'example'
    const data = { example: 'example response success' }
    res.success({ status, data, message })
    // response HTTP / status 201
    // {
    //      program: 'appName',
    //      version: '1.0.0',
    //      release: '42',
    //      datetime: '2019-03-10T16:50:38.546Z',
    //      timestamp: 1552236638546,
    //      status: 'success',
    //      code: 201,
    //      message: 'example',
    //      data: { 
    //         example: 'example response success' 
    //      }
    // }
})
```

`partial`: 
```js 
/**
 *   @description` success response HTTP with pagination to type 200 - 300
 *   @type function
 *   @param {{ 
 *       status: number | undefined, 
 *       payload: { 
 *           paginationCount: number, 
 *           paginationPage: number, 
 *           paginationLimit: number 
 *       },
 *       message: string | undefined
 *       data: Object | null
 *    } | undefined}
 */
```

`fail`: 
```js 
/**
 *   @description` error HTTP to type 400
 *   @type function
 *   @param {{ 
 *        status: number | undefined, 
 *        error: { 
 *           message: string | undefined, 
 *           errors: string[] | {key: string, value: string}[] | undefined
 *        } 
 *    } | undefined}
 */
```
by default: 
 - `status` = 400
 - `message` = invalid request


`error`:
```js 
/**
 *   @description` error HTTP to type 500
 *   @type function
 *   @param {{ 
 *        status: number | undefined, 
 *        error: { 
 *           message: string | undefined
 *        } 
 *    } | undefined}
 */
```
by default: 
 - `status` = 500
 - `message` = error server

###### code coverage :

File                          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------------|----------|----------|----------|----------|-------------------|
All files                     |      100 |      100 |      100 |      100 |                   |
 index.js                     |      100 |      100 |      100 |      100 |                   |
 lib/                         |      100 |      100 |      100 |      100 |                   |
  j-send.js                   |      100 |      100 |      100 |      100 |                   |
  middleware-error-handler.js |      100 |      100 |      100 |      100 |                   |


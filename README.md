## jsend-express

#### install in your project
`npm i jsend-express --save`

#### About

JSend-express is a complete implement to standard JSend in expressJs and it's extension. It's Simple API JSON Response Format, a JSend-compliant JSON Response Format for HTTP RESTful API (JSend standard & JSend-extend SAJ).
JSend-express are no dependencies

#### Usage

To use the middleware you simply import the default JSend function. Then use it as you would any other Express.js middleware. This middleware adds a jsend object to the Express.js Response object. It has 3 functions: success(), fail() and error(). 

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

#### Example server.js
```js
/**
* require express is required
*/
const express = require('express')

/**
* require JSend-express is required
*/
const { JSend } = require('JSend-express')

const routeExample = require('./route-example')

/**
* init express
*/
const app = express()

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
app.use('/example', routeExample)

// ...

```


###### code coverage :

File                          |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------------|----------|----------|----------|----------|-------------------|
All files                     |      100 |      100 |      100 |      100 |                   |
 index.js                     |      100 |      100 |      100 |      100 |                   |
 lib/                         |      100 |      100 |      100 |      100 |                   |
  j-send.js                   |      100 |      100 |      100 |      100 |                   |
  middleware-error-handler.js |      100 |      100 |      100 |      100 |                   |


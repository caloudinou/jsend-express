## jsend-express

# About

JSend-express is a complete implement to standard JSend in expressJs and it's extension. It's Simple API JSON Response Format, a JSend-compliant JSON Response Format for HTTP RESTful API (JSend standard & JSend-extend SAJ).
JSend-express are no dependencies

# Usage

To use the middleware you simply import the default JSend function. Then use it as you would any other Express.js middleware. This middleware adds a jsend object to the Express.js Response object. It has 3 functions: success(), fail() and error(). 

### Example
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
const jSend = new JSend({ name: 'yourAppName', version: 'VersionOnApp', release: 'YourReleaseOrYourLastCommit' })

/**
 * use middleware JSend to extend express after init app and before your route
 * @description
 * add {{ success: function, fail: function, partial: function, error: function}} in response of express   
 */
app.use(jSend.middleware.bind(jSend))

// your route
app.use('/example', routeExample)

// ...

```


###### code coverage :

File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |      100 |      100 |      100 |      100 |                   |
 j-send.js                   |      100 |      100 |      100 |      100 |                   |
 middleware-error-handler.js |      100 |      100 |      100 |      100 |                   |


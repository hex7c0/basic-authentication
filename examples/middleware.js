'use strict';
/**
 * @file express middleware example
 * @module basic-authentication
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var authentication = require('..'); // use require('basic-authentication') instead
var app = require('express')();

/*
 * using middleware for all routing
 */
app.use(authentication({
  user: 'foo', // set your custom user
  password: 'bar', // set your custom password
  suppress: true
}));

// express routing
app.get('/', function(req, res) {

  // authentication here
  res.send('hello world!');
}).get('/admin', function(req, res) {

  // authentication here
  res.send('authentication passed!');
});

// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

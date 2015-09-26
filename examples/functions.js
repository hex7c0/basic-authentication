'use strict';
/**
 * @file example with functions branch
 * @module basic-authentication
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var authentication = require('..'); // use require('basic-authentication') instead
var app = require('express')();

// return a function, instead of callback
var auth = authentication({
  functions: true
});

// express routing
app.get('/', function(req, res) {

  var encodedString = auth(req);
  res.send('get this string: ' + encodedString);
}).listen(3000);
console.log('starting "hello world" on port 3000');
// manually popolate Authorization header

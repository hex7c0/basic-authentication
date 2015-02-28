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
// import
var authentication = require('..'); // use require('basic-authentication') instead
var app = require('express')();

// using like middleware for all routing
var auth = authentication({
  functions: true, // return a function
});

// express routing
app.get('/', function(req, res) {

  var encodedString = auth(req);
  res.send('get this string: ' + encodedString);
});

// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');
// manually popolate Authorization header

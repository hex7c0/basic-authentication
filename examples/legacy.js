'use strict';
/**
 * @file legacy example
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

// use like a function
var auth = authentication({
  legacy: true
});

// express routing
app.get('/', function(req, res) {

  var found = auth(req);
  // return 'admin' and 'password' (default value) as object
  res.send('hello ' + found.user + ':' + found.password);
}).listen(3000);
console.log('starting "hello world" on port 3000');
// manually popolate Authorization header

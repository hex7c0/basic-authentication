'use strict';
/**
 * @file callback for only 1 route
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

var auth = authentication(); // use callback

// express routing
app.get('/admin', auth, function(req, res) {

  // only for "/admin" route
  // if user send wrong user/psw, module raise an error
  // you can suppress it with 'suppression' flag

  res.send('with auth'); // admin:password
}).get('/', function(req, res) {

  res.send('without auth');
}).listen(3000);
console.log('starting "hello world" on port 3000');

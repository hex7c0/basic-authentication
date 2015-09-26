'use strict';
/**
 * @file example with .htpasswd file
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

// using file middleware for all routing
app.use(authentication({
  hash: 'sha1', // type of hash
  file: 'htpasswd', // path of file
  suppress: true, // suppress throwing Error if wrong user
}));

// express routing
app.get('/', function(req, res) {

  // authentication here
  res.send('hello world!'); // pippo1:pippo
}).listen(3000);
console.log('starting "hello world" on port 3000');

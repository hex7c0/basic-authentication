'use strict';
/**
 * @file pure nodejs example
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
var http = require('http');

/*
 * use function
 */
var auth = authentication();

http.createServer(function(req, res) {

  if (auth(req, res)) {
    res.end('ok!');
  } else {
    res.end('ko!');
  }
}).listen(3000, '127.0.0.1');

// server starting
console.log('starting "hello world" on port 3000');

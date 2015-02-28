'use strict';
/**
 * @file example without close connection with client, and throw an Error
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
app.use(authentication({
  ending: false, // throw an error if wrong
}));

// express routing
app.get('/', function(req, res) {

  res.send('authentication passed! /');
}).get('/admin', function(req, res) {

  res.send('authentication passed! /admin');
});

// error handling
app.use(function(err, req, res, next) {

  res.send('error=' + err.message.toLowerCase()); // should print "error=unauthorized" if I'm wrong password
});

// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

"use strict";
/**
 * @file function example
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var authentication = require('../index.min.js'); // use require('basic-authentication')
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * use callback
 */
authentication = authentication();

// express routing
app.get('/admin',authentication,function(req,res) {

    // only for "/admin" route
    // if user send wrong user/psw, module raise an error
    // you can suppress with 'suppression' flag
    res.send('authentication passed!');
});
app.get('/',function(req,res) {

    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

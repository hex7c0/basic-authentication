'use strict';
/**
 * @file ending example
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
 * using middleware none for all routing
 */
app.use(authentication({
    ending: false,
}));

// express routing
app.get('/',function(req,res) {

    res.send('hello world!');
});
app.get('/admin',function(req,res) {

    res.send('authentication passed!');
});
// error handling
app.use(function(err,req,res,next) {

    res.send('error=' + err.message.toLowerCase());
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

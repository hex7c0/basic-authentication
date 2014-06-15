"use strict";
/**
 * @file middleware example
 * @package basic-authentication
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
    var authentication = require('../index.js'); // use require('basic-authentication') instead
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * using middleware for all routing
 */
app.use(authentication({
    password: 'foo',
    agent: 'hello!',
    suppress: true,
}));

// express routing
app.get('/',function(req,res) {

    // authentication here
    res.send('hello world!');
});
app.get('/admin',authentication,function(req,res) {

    // authentication here
    res.send('authentication passed!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

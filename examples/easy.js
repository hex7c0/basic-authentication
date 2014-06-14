"use strict";
/**
 * @file easy example
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
    var authentication = require('../index.js')({
        functions: true
    }); // use require('basic-authentication') instead
    var app = require('express')();
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * use like a function
 */
// express routing
app.get('/',function(req,res) {

    var user = authentication(req);
    res.send('hello ' + JSON.stringify(user));
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

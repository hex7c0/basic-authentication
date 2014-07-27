"use strict";
/**
 * @file legacy example
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
 * use like a function
 */
authentication = authentication({
    legacy: true
}); // use require('basic-authentication') instead

// express routing
app.get('/',function(req,res) {

    var auth = authentication(req);
    if (auth.user || auth.password) {
        // return 'admin' and 'password' (default value)
        res.send('hello ' + auth.user + ' ' + auth.password);
    } else {
        // if browser doesn't send basic authentication header
        res.status(401).send('nope');
    }
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

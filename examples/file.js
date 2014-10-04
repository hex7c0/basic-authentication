'use strict';
/**
 * @file file example
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
 * using file middleware for all routing
 */
app.use(authentication({
    hash: 'sha1',
    file: 'htpasswd',
    suppress: true,
}));

// express routing
app.get('/',function(req,res) {

    // authentication here
    res.send('hello world!');
});
// server starting
app.listen(3000);
console.log('starting "hello world" on port 3000');

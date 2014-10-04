'use strict';
/**
 * @file nodejs example
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
    var http = require('http');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * use function
 */
authentication = authentication();

http.createServer(function(req,res) {

    if (authentication(req,res)) {
        res.end('authentication passed!');
    } else {
        res.end('nope!');
    }
}).listen(3000,'127.0.0.1');
console.log('starting "hello world" on port 3000');

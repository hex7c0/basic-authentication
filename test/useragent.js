'use strict';
/**
 * @file useragent test
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage test
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
    var request = require('supertest');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * test module
 */
describe('useragent',function() {

    before(function(done) {

        app.use(authentication({
            password: 'foo',
            agent: 'SuPeR',
            suppress: true,
        }));
        app.get('/',function(req,res) {

            res.send('hello world!');
        });
        done();
    });

    it('incorrect - should return 403 status code',function(done) {

        var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
        request(app).get('/').set('Authorization',p).expect(403,done);
    });

    it('correct - should return 200 status code',function(done) {

        var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
        request(app).get('/').set('user-agent','SuPeR').set('Authorization',p)
                .expect(200,done);
    });

});

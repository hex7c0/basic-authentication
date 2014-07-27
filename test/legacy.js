"use strict";
/**
 * @file legacy test
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
describe('legacy',function() {

    before(function(done) {

        var Authentication = authentication({
            legacy: true
        });
        app.get('/',function(req,res) {

            var auth = Authentication(req);
            if (auth.user || auth.password) {
                // return 'admin' and 'password' (default value)
                res.send('hello ' + auth.user + ' ' + auth.password);
            } else {
                // if browser doesn't send basic authentication header
                res.status(401).send('nope');
            }
        });
        done();
    });

    it('correct - should return 200 status code',function(done) {

        var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
        request(app).get('/').set('Authorization',p).expect(200,done);
    });

    it('no header - should return 401 status code',function(done) {

        request(app).get('/').expect(401,done);
    });

    describe('credential',function() {

        it('wrong psw - should return 200 status code',function(done) {

            var p = 'Basic ' + new Buffer('admin:pippo').toString('base64');
            request(app).get('/').set('Authorization',p).expect(200,done);
        });

        it('empty psw - should return 200 status code',function(done) {

            var p = 'Basic ' + new Buffer('admin:').toString('base64');
            request(app).get('/').set('Authorization',p).expect(200,done);
        });

        it('empty id - should return 200 status code',function(done) {

            var p = 'Basic ' + new Buffer(':foo').toString('base64');
            request(app).get('/').set('Authorization',p).expect(200,done);
        });

        it('empty both - should return 401 status code',function(done) {

            var p = 'Basic ' + new Buffer(':').toString('base64');
            request(app).get('/').set('Authorization',p).expect(401,done);
        });
    });

    describe('malformed',function() {

        it('header - should return 401 status code',function(done) {

            var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
            request(app).get('/').set('Authorizatio',p).expect(401,done);
        });

        it('basic - should return 401 status code',function(done) {

            var p = 'Basic: ' + new Buffer('admin:foo').toString('base64');
            request(app).get('/').set('Authorization',p).expect(401,done);
        });
    });

});

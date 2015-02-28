'use strict';
/**
 * @file legacy test
 * @module basic-authentication
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
var authentication = require('..');
var app = require('express')();
var request = require('supertest');

/*
 * test module
 */
describe('legacy', function() {

  before(function(done) {

    var auth = authentication({
      legacy: true
    });
    app.get('/', function(req, res) {

      var found = auth(req);
      if (found.user && found.password) {
        // return 'admin' and 'password' (default value)
        res.send('hello ' + found.user + ' ' + found.password);
      } else {
        // if browser doesn't send basic foundentication header
        res.status(401).send('nope');
      }
    });
    done();
  });

  it('should return 200', function(done) {

    var p = 'Basic ' + new Buffer('admin:password').toString('base64');
    request(app).get('/').set('Authorization', p).expect(200, done);
  });

  describe('header', function() {

    it('should return 401, because no header', function(done) {

      request(app).get('/').expect(401, done);
    });
    it('should return 401, because wrong header', function(done) {

      var p = 'Basic ' + new Buffer('admin:foo').toString('base64');
      request(app).get('/').set('AuthorizatioFoo', p).expect(401, done);
    });
    it('should return 401, because wrong string', function(done) {

      var p = 'Foo ' + new Buffer('admin:password').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
  });

  describe('credential', function() {

    it('should return 401, because no encoded string', function(done) {

      var p = 'Basic admin:password';
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because empty id', function(done) {

      var p = 'Basic ' + new Buffer(':password').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because empty psw', function(done) {

      var p = 'Basic ' + new Buffer('admin:').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because both empty', function(done) {

      var p = 'Basic ' + new Buffer(':').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
  });
});

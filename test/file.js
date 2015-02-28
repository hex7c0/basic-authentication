'use strict';
/**
 * @file file test
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
var authentication = require('..');
var app = require('express')();
var request = require('supertest');

/*
 * test module
 */
describe('file', function() {

  before(function(done) {

    app.use(authentication({
      hash: 'sha1',
      file: __dirname + '/../examples/htpasswd',
      suppress: true
    })).get('/', function(req, res) {

      res.send('hello world!');
    });
    done();
  });

  it('should return pippo1 200', function(done) {

    var p = 'Basic ' + new Buffer('pippo1:pippo').toString('base64');
    request(app).get('/').set('Authorization', p).expect(200, done);
  });
  it('should return pippo2 200', function(done) {

    var p = 'Basic ' + new Buffer('pippo2:pippo').toString('base64');
    request(app).get('/').set('Authorization', p).expect(200, done);
  });
  it('should return pippo3 200', function(done) {

    var p = 'Basic ' + new Buffer('pippo3:pippo').toString('base64');
    request(app).get('/').set('Authorization', p).expect(200, done);
  });
  it('should return pippo4 200', function(done) {

    var p = 'Basic ' + new Buffer('pippo4:pippo').toString('base64');
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
    it('should return 401, because wrong id', function(done) {

      var p = 'Basic ' + new Buffer('pippo:password').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because empty id', function(done) {

      var p = 'Basic ' + new Buffer(':password').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because wrong psw', function(done) {

      var p = 'Basic ' + new Buffer('admin:pippo').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because empty psw', function(done) {

      var p = 'Basic ' + new Buffer('admin:').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because both wrong', function(done) {

      var p = 'Basic ' + new Buffer('foo:foo').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
    it('should return 401, because both empty', function(done) {

      var p = 'Basic ' + new Buffer(':').toString('base64');
      request(app).get('/').set('Authorization', p).expect(401, done);
    });
  });
});

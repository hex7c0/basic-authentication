'use strict';
/**
 * @file useragent test
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
var assert = require('assert');

/*
 * test module
 */
describe('useragent', function() {

  before(function(done) {

    app.use(authentication({
      realm: 'PiPPo',
      user: 'foo',
      password: 'bar',
      agent: 'SuPeR',
      suppress: true,
    })).get('/', function(req, res) {

      res.send('hello world!');
    });
    done();
  });

  it('should return 200, with correct user, password and user-agent',
    function(done) {

      var p = 'Basic ' + new Buffer('foo:bar').toString('base64');
      request(app).get('/').set('user-agent', 'SuPeR').set('Authorization', p)
          .expect(200, done);
    });
  it('should return 403, with correct user and password', function(done) {

    var p = 'Basic ' + new Buffer('foo:bar').toString('base64');
    request(app).get('/').set('Authorization', p).expect(403, done);
  });
  it('should return 401, with correct user-agent', function(done) {

    var p = 'Basic ' + new Buffer(':').toString('base64');
    request(app).get('/').set('user-agent', 'SuPeR').set('Authorization', p)
        .expect(401, done);
  });
  it('should return 401, check Realm', function(done) {

    request(app).get('/').expect(401).end(function(err, res) {

      assert.ifError(err);
      assert.equal(res.header['www-authenticate'], 'Basic realm="PiPPo"');
      done();
    });
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

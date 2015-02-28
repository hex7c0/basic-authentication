'use strict';
/**
 * @file functions test
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
var express = require('express');
var request = require('supertest');
var assert = require('assert');

/*
 * test module
 */
describe('ending', function() {

  var app, auth;

  beforeEach(function(done) {

    auth = authentication({
      functions: true
    });
    app = express();
    done();
  });

  it('should return 404', function(done) {

    var p = 'Basic ' + new Buffer('admin:password').toString('base64');
    request(app).get('/').set('Authorization', p).expect(404, done);
  });
  it('should return Base64 string', function(done) {

    var b = new Buffer('admin:password').toString('base64');
    app.get('/', function(req, res) {

      assert.equal(auth(req), b);
      res.send('hello world!');
      done();
    });
    var p = 'Basic ' + b;
    request(app).get('/').set('Authorization', p).expect(200).end(
      function(err) {

        assert.equal(err, null);
      });
  });

  describe('header', function() {

    it('should return empty string, because no header', function(done) {

      app.get('/', function(req, res) {

        assert.equal(auth(req), '');
        res.send('hello world!');
        done();
      });
      request(app).get('/').expect(200).end(function(err) {

        assert.equal(err, null);
      });
    });
    it('should return empty string, because wrong header', function(done) {

      app.get('/', function(req, res) {

        assert.equal(auth(req), '');
        res.send('hello world!');
        done();
      });
      var p = 'Basic ' + new Buffer('admin:password').toString('base64');
      request(app).get('/').set('AuthorizatioFoo', p).expect(200).end(
        function(err) {

          assert.equal(err, null);
        });
    });
    it('should return empty string, because wrong string', function(done) {

      app.get('/', function(req, res) {

        assert.equal(auth(req), '');
        res.send('hello world!');
        done();
      });
      var p = 'Foo ' + new Buffer('admin:password').toString('base64');
      request(app).get('/').set('Authorization', p).expect(200).end(
        function(err) {

          assert.equal(err, null);
        });
    });
  });
});

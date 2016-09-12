'use strict';
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @subpackage main
 * @version 1.7.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
var http = require('http').STATUS_CODES;
var crypto = require('crypto').createHash;
var setHeader = require('setheaders').setWritableHeader;
// regexp
var reg = new RegExp(/^Basic (.*)$/);
var basic = new RegExp(/^([^:]*):(.*)$/);
var end = new RegExp(/(.+)/g);

/*
 * functions
 */
/**
 * empty function
 * 
 * @function end_empty
 */
function end_empty() {

  return;
}

/**
 * end with error. Propagate Error to callback
 * 
 * @function end_err
 * @param {next} next - continue routes
 * @param {String} code - response error
 * @return {Error}
 */
function end_err(next, code) {

  var err = new Error(code);
  return next ? next(err) : err;
}

/**
 * end of work
 * 
 * @function end_work
 * @param {Function} err - error function
 * @param {Function} [next] - continue routes
 * @param {Integer} [code] - response error code
 * @param {Object} [res] - response to client
 * @return {Function|Boolean}
 */
function end_work(err, next, code, res) {

  if (code === undefined) { // success
    return next ? next() : true;
  }

  var codes = http[code]; // error

  if (res !== undefined) { // basic_big
    res.writeHead(code);
    res.end(codes);
  }

  return err(next, codes); // basic_medium
}

/**
 * end check
 * 
 * @function end_check
 * @param {String} auth - base64 request
 * @param {String} hash - user hash
 * @return {Boolean}
 */
function end_check(auth, hash) {

  return auth !== hash;
}

/**
 * end check
 * 
 * @function end_check_file
 * @param {String} auth - base64 request
 * @param {String} hash - user hash
 * @param {String} file - read hash from file
 * @return {Boolean}
 */
function end_check_file(auth, hash, file) {

  var hashes = crypto(hash);
  var input = require('fs').readFileSync(file, {
    encoding: 'utf8',
  }).match(end);
  var ii = input.length || 0;

  var request = basic_legacy(auth, true);
  if (!request.user || !request.password) { // empty field
    return true;
  }

  var psw = hashes.update(request.password).digest('hex');
  request = new RegExp('^' + request.user + ':');
  for (var i = 0; i < ii; ++i) {
    if (request.test(input[i])) {
      var get = input[i].substring(request.source.length - 1);
      if (get === psw) {
        return false;
      }
    }
  }
  return true;
}

/**
 * protection function with basic authentication (deprecated)
 * 
 * @deprecated
 * @function basic_legacy
 * @param {Object|String} req - client request or check this string with force flag
 * @param {Boolean} [force] - flag for forcing op
 * @return {Object}
 */
function basic_legacy(req, force) {

  var auth;
  if (force === true) {
    auth = new Buffer(req, 'base64').toString('utf8');
    if ((auth = auth.match(basic)) && auth[1]) {
      return {
        user: auth[1],
        password: auth[2]
      };
    }
    return Object.create(null);
  }

  if (req.headers && (auth = req.headers.authorization)) {
    if ((auth = auth.match(reg)) && auth[1]) {
      auth = new Buffer(auth[1], 'base64').toString('utf8').match(basic);
      if (auth) {
        return {
          user: auth[1],
          password: auth[2]
        };
      }
    }
  }
  return Object.create(null);
}

/**
 * check existence of basic authentication header. Return this string without "Basic "
 * 
 * @function basic_small
 * @param {Object} req - client request
 * @return {String}
 */
function basic_small(req) {

  var auth;
  if (req.headers && (auth = req.headers.authorization)) {
    if (reg.test(auth) === true) { // test basic header
      return auth.substring(6); // return Base64 string without "Basic "
    }
  }
  return '';
}

/**
 * setting options
 * 
 * @exports authentication
 * @function authentication
 * @param {Object} opt - various options. Check README.md
 * @return {Function}
 */
function authentication(opt) {

  var options = opt || Object.create(null);

  if (Boolean(options.legacy)) {
    return basic_legacy;
  } else if (Boolean(options.functions)) {
    return basic_small;
  }

  var my = {
    file: Boolean(options.file),
    agent: String(options.agent || ''),
    realm: String(options.realm || 'Authorization required'),
    suppress: Boolean(options.suppress)
  };
  my.realms = 'Basic realm="' + my.realm + '"';
  my.realm = {
    'WWW-Authenticate': my.realms
  };

  // user
  var check;
  if (my.file) {
    my.hash = String(options.hash || 'md5');
    my.file = require('path').resolve(String(options.file));
    if (!require('fs').existsSync(my.file)) {
      var err = my.file + ' not exists';
      throw new Error(err);
    }

    check = end_check_file;

  } else {
    var user = String(options.user || 'admin');
    var password = String(options.password || 'password');
    my.hash = new Buffer(user + ':' + password).toString('base64');

    check = end_check;
  }

  // error handler
  var err = end_err;
  if (my.suppress) {
    err = end_empty;
  }

  /**
   * protection middleware with basic authentication without res.end
   * 
   * @function basic_medium
   * @param {Object} req - client request
   * @param {Object} res - response to client
   * @param {next} [next] - continue routes
   */
  function basic_medium(req, res, next) {

    var auth = basic_small(req);
    if (auth !== '') {
      if (check(auth, my.hash, my.file) === true) { // check if different
        return setHeader(res, 'WWW-Authenticate', my.realms) === true
          ? end_work(err, next, 401) : null;
      }

      if (my.agent === '' || my.agent === req.headers['user-agent']) { // check UA
        return end_work(err, next);
      }

      return end_work(err, next, 403);
    }

    // first attempt
    res.writeHead(401, my.realm);
    return res.end();
  }

  /**
   * protection middleware with basic authentication and error handling
   * 
   * @function basic_big
   * @param {Object} req - client request
   * @param {Object} res - response to client
   * @param {next} [next] - continue routes
   * @return {void}
   */
  function basic_big(req, res, next) {

    var auth = basic_small(req);
    if (auth !== '') {
      if (check(auth, my.hash, my.file) === true) { // check if different
        return setHeader(res, 'WWW-Authenticate', my.realms) === true
          ? end_work(err, next, 401, res) : null;
      }

      if (my.agent === '' || my.agent === req.headers['user-agent']) { // check UA
        return end_work(err, next);
      }

      return end_work(err, next, 403, res);
    }

    // first attempt
    res.writeHead(401, my.realm);
    return res.end(http[401]);
  }

  // return
  if (options.ending === false) {
    return basic_medium;
  }
  return basic_big;
}
module.exports = authentication;

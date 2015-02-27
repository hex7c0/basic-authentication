'use strict';
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @subpackage main
 * @version 1.5.0
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
 * end of error
 * 
 * @function end_err
 * @param {next} next - continue routes
 * @param {String} code - response error
 * @return {Error}
 */
function end_err(next, code) {

  return next !== undefined ? next(new Error(code)) : new Error(code);
}

/**
 * end of work
 * 
 * @function end_work
 * @param {Function} err - error function
 * @param {next} [next] - continue routes
 * @param {Integer} [code] - response error code
 * @param {Object} [res] - response to client
 * @return {next|Boolean}
 */
function end_work(err, next, code, res) {

  if (code === undefined) { // success
    return next !== undefined ? next() : true;
  }
  // error
  var codes = http[code];
  if (res !== undefined) { // output
    res.writeHead(code);
    res.end(codes);
  }
  return err(next, codes);
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
  var ii;
  if (input.length) {
    ii = input.length;
  } else {
    ii = 0;
  }
  var request = basic_legacy(auth, true);
  var psw = hashes.update(request.password).digest('hex');
  request = new RegExp('^' + request.user + ':');
  for (var i = 0; i < ii; i++) {
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
 * @param {Object} req - client request
 * @param {Boolean} [force] - flag for forcing op
 * @return {Object}
 */
function basic_legacy(req, force) {

  var auth;
  if (force === true) {
    auth = new Buffer(req, 'base64').toString();
    auth = auth.match(basic);
    return {
      user: auth[1],
      password: auth[2]
    };
  }
  if (req.headers !== undefined
    && (auth = req.headers.authorization) !== undefined) {
    if ((auth = auth.match(reg)) && auth[1] !== undefined) {
      auth = new Buffer(auth[1], 'base64').toString().match(basic);
      if (auth !== undefined) {
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
 * protection function with basic authentication
 * 
 * @function basic_small
 * @param {Object} req - client request
 * @return {String}
 */
function basic_small(req) {

  var auth;
  if (req.headers !== undefined
    && (auth = req.headers.authorization) !== undefined) {
    if (reg.test(auth) === true) {
      return auth.substring(6);
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
  var my = {
    file: Boolean(options.file),
    agent: String(options.agent || ''),
    realm: String(options.realm || 'Authorization required'),
    suppress: Boolean(options.suppress),
  };
  my.realms = 'Basic realm="' + my.realm + '"';
  my.realm = {
    'WWW-Authenticate': my.realms,
  };

  if (my.file) {
    my.hash = String(options.hash || 'md5');
    my.file = require('path').resolve(String(options.file));
    if (!require('fs').existsSync(my.file)) {
      var err = my.file + ' not exists';
      throw new Error(err);
    }
  } else {
    var user = String(options.user || 'admin');
    var password = String(options.password || 'password');
    my.hash = new Buffer(user + ':' + password).toString('base64');
  }

  /**
   * wrapper for medium function
   * 
   * @function wrapper_medium
   * @return {Function}
   */
  function wrapper_medium() {

    var check = end_check;
    if (my.file) {
      check = end_check_file;
    }
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
    return function basic_medium(req, res, next) {

      var auth = basic_small(req);
      if (auth !== '') {
        if (check(auth, my.hash, my.file) === true) {
          if (setHeader(res, 'WWW-Authenticate', my.realms)) {
            end_work(err, next, 401);
          }
          return;
        }
        if (my.agent === '' || my.agent === req.headers['user-agent']) {
          return end_work(err, next);
        }
        return end_work(err, next, 403);
      }
      // first attempt
      res.writeHead(401, my.realm);
      return res.end();
    };
  }

  /**
   * wrapper for big function
   * 
   * @function wrapper_big
   * @return {Function}
   */
  function wrapper_big() {

    var check = end_check;
    if (my.file) {
      check = end_check_file;
    }
    var err = end_err;
    if (my.suppress) {
      err = end_empty;
    }

    /**
     * protection middleware with basic authentication and error handling
     * 
     * @function basic_big
     * @param {Object} req - client request
     * @param {Object} res - response to client
     * @param {next} [next] - continue routes
     * @return {Boolean}
     */
    return function basic_big(req, res, next) {

      var auth = basic_small(req);
      if (auth !== '') {
        if (check(auth, my.hash, my.file) === true) {
          if (setHeader(res, 'WWW-Authenticate', my.realms)) {
            end_work(err, next, 401, res);
          }
          return;
        }
        if (my.agent === '' || my.agent === req.headers['user-agent']) {
          return end_work(err, next);
        }
        return end_work(err, next, 403, res);
      }
      // first attempt
      res.writeHead(401, my.realm);
      return res.end(http[401]);
    };
  }

  // return
  if (Boolean(options.legacy)) {
    return basic_legacy;
  } else if (Boolean(options.functions)) {
    return basic_small;
  } else if (options.ending === false ? true : false) {
    return wrapper_medium();
  }
  return wrapper_big();
}
module.exports = authentication;

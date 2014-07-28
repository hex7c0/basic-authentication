"use strict";
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage main
 * @version 1.4.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var reg = new RegExp(/^Basic (.*)$/);
var http = require('http').STATUS_CODES;
var crypto = require('crypto').createHash;

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
function end_err(next,code) {

    return next(new Error(code));
}
var end_err_tmp = end_err;

/**
 * end of work
 * 
 * @function end_work
 * @param {next} [next] - continue routes
 * @param {Integer} [code] - response error code
 * @param {Object} [res] - response to client
 * @return {next|Boolean}
 */
function end_work(next,code,res) {

    if (code == undefined) { // success
        try {
            return next();
        } catch (TypeError) {
            return true;
        }
    }
    // error
    var codes = http[code];
    if (typeof (res) == 'object') { // output
        res.writeHead(code);
        res.end(codes);
    }
    try {
        return end_err(next,codes);
    } catch (TypeError) {
        return false;
    }
}

/**
 * end check
 * 
 * @function end_check
 * @param {String} auth - base64 request
 * @param {String} hash - user hash
 * @return {Boolean}
 */
function end_check(auth,hash) {

    return auth != hash;
}
var end_check_tmp = end_check;

/**
 * end check
 * 
 * @function end_check_file
 * @param {String} auth - base64 request
 * @param {String} hash - user hash
 * @param {String} file - read hash from file
 * @return {Boolean}
 */
function end_check_file(auth,hash,file) {

    var hash = crypto(hash);
    var input = require('fs').readFileSync(file,{
        encoding: 'utf8',
    }).match(/(.+)/g);
    var ii;
    try {
        ii = input.length;
    } catch (TypeError) {
        ii = 0;
    }
    var request = basic_legacy(auth,true);
    var psw = hash.update(request.password).digest('hex');
    request = new RegExp('^' + request.user + ':');
    for (var i = 0; i < ii; i++) {
        if (request.test(input[i])) {
            var get = input[i].substring(request.source.length - 1);
            if (get == psw) {
                return false;
            }
        }
    }
    return true;
}

/**
 * protection function with basic authentication (deprecated)
 * 
 * @function basic_legacy
 * @param {Object} req - client request
 * @param {Boolean} [force] - flag for forcing op
 * @return {Object}
 */
function basic_legacy(req,force) {

    var auth;
    if (force == true) {
        auth = new Buffer(req,'base64').toString();
        auth = auth.match(/^([^:]*):(.*)$/);
        return {
            user: auth[1],
            password: auth[2]
        };
    }
    if (req.headers && (auth = req.headers.authorization)) {
        if ((auth = auth.match(reg)) && auth[1]) {
            auth = new Buffer(auth[1],'base64').toString();
            if (auth = auth.match(/^([^:]*):(.*)$/)) {
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
    if (req.headers && (auth = req.headers.authorization)) {
        if (reg.test(auth)) {
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
 * @param {Object} options - various options. Check README.md
 * @return {Function}
 */
module.exports = function authentication(options) {

    var options = options || Object.create(null);
    var my = {
        file: Boolean(options.file),
        agent: String(options.agent || ''),
        realm: String(options.realm || 'Authorization required'),
        suppress: Boolean(options.suppress),
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

    // return
    if (Boolean(options.legacy)) {
        return basic_legacy;
    } else if (Boolean(options.functions)) {
        return basic_small;
    } else if (options.ending == false ? true : false) {
        return wrapper_medium();
    }

    function wrapper_medium() {

        end_check = end_check_tmp;
        if (my.file) {
            end_check = end_check_file;
        }
        end_err = end_err_tmp;
        if (my.suppress) {
            end_err = end_empty;
        }
        /**
         * protection middleware with basic authentication without res.end
         * 
         * @function basic_medium
         * @param {Object} req - client request
         * @param {Object} res - response to client
         * @param {next} [next] - continue routes
         */
        return function basic_medium(req,res,next) {

            var auth;
            if (auth = basic_small(req)) {
                if (end_check(auth,my.hash,my.file)) {
                    res.setHeader('WWW-Authenticate','Basic realm="' + my.realm
                            + '"');
                    return end_work(next,401);
                } else if (!my.agent || my.agent == req.headers['user-agent']) {
                    return end_work(next);
                }
                return end_work(next,403);
            }
            // first attempt
            res.writeHead(401,{
                'WWW-Authenticate': 'Basic realm="' + my.realm + '"',
            });
            res.end();
            return;
        };
    }

    return wrapper_big();
    function wrapper_big() {

        end_check = end_check_tmp;
        if (my.file) {
            end_check = end_check_file;
        }
        end_err = end_err_tmp;
        if (my.suppress) {
            end_err = end_empty;
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
        return function basic_big(req,res,next) {

            var auth;
            if (auth = basic_small(req)) {
                if (end_check(auth,my.hash,my.file)) {
                    res.setHeader('WWW-Authenticate','Basic realm="' + my.realm
                            + '"');
                    return end_work(next,401,res);
                } else if (!my.agent || my.agent == req.headers['user-agent']) {
                    return end_work(next);
                }
                return end_work(next,403,res);
            }
            // first attempt
            res.writeHead(401,{
                'WWW-Authenticate': 'Basic realm="' + my.realm + '"',
            });
            res.end(http[401]);
            return;
        };
    }
};

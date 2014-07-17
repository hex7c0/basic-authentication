"use strict";
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage main
 * @version 1.2.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var my = null;
var reg = new RegExp(/^Basic (.+)$/i);

/*
 * functions
 */
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

/**
 * end of work
 * 
 * @function end_work
 * @param {next} [next] - continue routes
 * @param {String} [code] - response error
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
    } else { // error
        if (typeof (res) == 'object') { // output
            if (code == 'unauthorized') {
                res.statusCode = 401;
                res.end(code);
            } else if (code == 'forbidden') {
                res.statusCode = 403;
                res.end(code);
            }
        }
        try {
            return end_err(next,code);
        } catch (TypeError) {
            return false;
        }
    }
}

/**
 * protection function with basic authentication (deprecated)
 * 
 * @deprecated
 * @function basic_legacy
 * @param {Object} req - client request
 * @return {Object}
 */
function basic_legacy(req) {

    var auth = null;
    if (auth = req.headers.authorization) {
        auth = auth.match(/^Basic (.+)$/i);
        if (auth[1]) {
            auth = new Buffer(auth[1],'base64').toString();
            auth = auth.match(/^([^:]*):(.*)$/i);
            if (auth) {
                return {
                    user: auth[1],
                    password: auth[2]
                };
            }
        }
    }
    return {};
}

/**
 * protection function with basic authentication
 * 
 * @function basic_small
 * @param {Object} req - client request
 * @return {String}
 */
function basic_small(req) {

    var auth = null;
    if (auth = req.headers.authorization) {
        if (reg.test(auth)) {
            return auth.substring(6);
        }
    }
    return '';
}

/**
 * protection middleware with basic authentication without res.end
 * 
 * @function basic_medium
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} [next] - continue routes
 * @return
 */
function basic_medium(req,res,next) {

    var options = my;
    var auth = null;
    if (auth = basic_small(req)) {
        if (auth != options.hash) {
            res.setHeader('WWW-Authenticate','Basic realm="' + options.realm
                    + '"');
            res.statusCode = 401;
            return end_work(next,'unauthorized');
        } else if (!options.agent) {
            return end_work(next);
        } else if (options.agent == req.headers['user-agent']) {
            return end_work(next);
        }
        res.statusCode = 403;
        return end_work(next,'forbidden');
    }
    // first attempt
    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
    res.statusCode = 401;
    res.end();
    return;
}

/**
 * protection middleware with basic authentication and error handling
 * 
 * @function basic_big
 * @param {Object} req - client request
 * @param {Object} [res] - response to client
 * @param {next} [next] - continue routes
 * @return {Boolean}
 */
function basic_big(req,res,next) {

    var options = my;
    var auth = null;
    if (auth = basic_small(req)) {
        if (auth != options.hash) {
            res.setHeader('WWW-Authenticate','Basic realm="' + options.realm
                    + '"');
            return end_work(next,'unauthorized',res);
        } else if (!options.agent) {
            return end_work(next);
        } else if (options.agent == req.headers['user-agent']) {
            return end_work(next);
        }
        return end_work(next,'forbidden',res);
    }
    // first attempt
    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
    res.statusCode = 401;
    res.end('unauthorized');
    return;
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

    var options = options || {};
    var user = String(options.user || 'admin');
    var password = String(options.password || 'password');
    my = {
        hash: new Buffer(user + ':' + password).toString('base64'),
        agent: String(options.agent || ''),
        realm: String(options.realm || 'Authorization required'),
    };
    if (Boolean(options.suppress)) {
        end_err = function() {

            return;
        };
    }
    if (options.ending == false ? true : false) {
        basic_legacy = basic_big = null;
        return basic_medium;
    } else if (Boolean(options.functions)) {
        my = end_err = end_work = basic_legacy = basic_medium = basic_big = null;
        return basic_small;
    } else if (Boolean(options.basic_legacy)) {
        my = end_err = end_work = basic_small = basic_medium = basic_big = null;
        return basic_legacy;
    }
    basic_legacy = basic_medium = null;
    return basic_big;
};

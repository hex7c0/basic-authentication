"use strict";
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage main
 * @version 1.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * initialize module
 */
var my = {}, end = error;

/*
 * functions
 */
/**
 * end of work with error
 * 
 * @function normal
 * @param {next} next - continue routes
 * @param {String} code - response to client
 * @return {next}
 */
function error(next,code) {

    return next(new Error(code));
}
/**
 * protection middleware with basic authentication
 * 
 * @function big
 * @param {Object} req - client request
 * @param {Object} res - response to client
 * @param {next} [next] - continue routes
 * @return
 */
function big(req,res,next) {

    var auth = null;
    var options = my;
    if (auth = req.headers.authorization) {
        auth = auth.split(' ');
        if ('basic' == auth[0].toLowerCase() && auth[1]) {
            auth = new Buffer(auth[1],'base64').toString();
            auth = auth.match(/^([^:]+):(.+)$/);
            if (auth) {
                if (auth[1] != options.user || auth[2] != options.password) {
                    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
                    try {
                        res.status(401).end('Unauthorized');
                        return end(next,'unauthorized');
                    } catch (TypeError) {
                        res.statusCode = 401;
                        return res.end('unauthorized');
                    }
                } else if (!options.agent) {
                    try {
                        return next();
                    } catch (TypeError) {
                        return;
                    }
                } else if (options.agent == req.headers['user-agent']) {
                    try {
                        return next();
                    } catch (TypeError) {
                        return;
                    }
                }
                try {
                    res.status(403).end('Forbidden');
                    return end(next,'forbidden');
                } catch (TypeError) {
                    res.statusCode = 403;
                    return res.end('forbidden');
                }
            }
        }
    }
    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
    try {
        res.status(401).end('Unauthorized');
        return;
    } catch (TypeError) {
        res.statusCode = 401;
        return res.end('unauthorized');
    }
}
/**
 * protection function with basic authentication
 * 
 * @function small
 * @param {Object} req - client request
 * @return {Object|Boolean}
 */
function small(req) {

    var auth = null;
    try {
        req = req.req || req;
    } catch (e) {
        return false;
    }
    if (auth = req.headers.authorization) {
        auth = auth.split(' ');
        if ('basic' == auth[0].toLowerCase() && auth[1]) {
            auth = new Buffer(auth[1],'base64').toString();
            auth = auth.match(/^([^:]+):(.+)$/);
            if (auth) {
                return {
                    user: auth[1],
                    password: auth[2]
                };
            }
        }
    }
    return false;
}
/**
 * setting options
 * 
 * @exports main
 * @function main
 * @param {Object} options - various options. Check README.md
 * @return {Function}
 */
module.exports = function(options) {

    var options = options || {};
    my = {
        user: String(options.user || 'admin'),
        password: String(options.password || 'password'),
        agent: String(options.agent || ''),
        realm: String(options.realm || 'Authorization required'),
    }
    if (Boolean(options.functions)) {
        my = end = null;
        return small;
    }
    if (Boolean(options.suppress)) {
        end = function() {

            return;
        };
    }
    return big;
};

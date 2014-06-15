"use strict";
/**
 * @file basic-authentication main
 * @module basic-authentication
 * @package basic-authentication
 * @subpackage main
 * @version 1.0.2
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
 * protection function with basic authentication
 * 
 * @function small
 * @param {Object} req - client request
 * @return {Object|Boolean}
 */
function small(req) {

    var auth = null;
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
 * protection middleware with basic authentication
 * 
 * @function medium
 * @param {Object} req - client request
 * @param {Object} [res] - response to client
 * @param {next} [next] - continue routes
 * @return
 */
function medium(req,res,next) {

    var options = my;
    var auth = small(req);
    if (auth) {
        if (auth.user != options.user || auth.password != options.password) {
            res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
            try {
                return end(next,'unauthorized');
            } catch (TypeError) {
                return;
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
            return end(next,'forbidden');
        } catch (TypeError) {
            return;
        }
    }
    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
    res.statusCode = 401;
    try {
        return end(next,'unauthorized');
    } catch (TypeError) {
        return;
    }
}
/**
 * protection middleware with basic authentication and error handling
 * 
 * @function big
 * @param {Object} req - client request
 * @param {Object} [res] - response to client
 * @param {next} [next] - continue routes
 * @return
 */
function big(req,res,next) {

    var options = my;
    var auth = small(req);
    if (auth) {
        if (auth.user != options.user || auth.password != options.password) {
            res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
            res.statusCode = 401;
            res.end('Unauthorized');
            try {
                return end(next,'unauthorized');
            } catch (TypeError) {
                return;
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
        res.statusCode = 403;
        res.end('Forbidden');
        try {
            return end(next,'forbidden');
        } catch (TypeError) {
            return;
        }
    }
    res.setHeader('WWW-Authenticate','Basic realm="' + options.realm + '"');
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
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
    if (Boolean(options.suppress)) {
        end = function() {

            return;
        };
    }
    if (options.ending == false ? true : false) {
        big = null;
        return medium;
    } else if (Boolean(options.functions)) {
        my = end = medium = big = null;
        return small;
    }
    return big;
};

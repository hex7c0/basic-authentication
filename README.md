# [basic-authentication](https://github.com/hex7c0/basic-authentication)

[![NPM version](https://img.shields.io/npm/v/basic-authentication.svg)](https://www.npmjs.com/package/basic-authentication)
[![Linux Status](https://img.shields.io/travis/hex7c0/basic-authentication.svg?label=linux)](https://travis-ci.org/hex7c0/basic-authentication)
[![Windows Status](https://img.shields.io/appveyor/ci/hex7c0/basic-authentication.svg?label=windows)](https://ci.appveyor.com/project/hex7c0/basic-authentication)
[![Dependency Status](https://img.shields.io/david/hex7c0/basic-authentication.svg)](https://david-dm.org/hex7c0/basic-authentication)
[![Coveralls](https://img.shields.io/coveralls/hex7c0/basic-authentication.svg)](https://coveralls.io/r/hex7c0/basic-authentication)

Basic authentication is method for a HTTP user agent to provide a user name and password.

## Installation

Install through NPM

```bash
npm install basic-authentication
```
or
```bash
git clone git://github.com/hex7c0/basic-authentication.git
```

## API

inside expressjs project like a middleware
```js
var authentication = require('basic-authentication')();

var app = require('express')();
app.use(authentication);
```
inside expressjs project like a callback for certain route
```js
var authentication = require('basic-authentication')();

var app = require('express')();
app.get('/', authentication, function(req, res) {

    res.send('ok');
});
```
inside routing like a function
```js
var authentication = require('basic-authentication')({functions: true});

var app = require('express')();
app.get('/', function(req, res) {

    var user = authentication(req);
    if (user == 'foo') {
        res.send('ok');
    } else {
        res.send('ko');
    }
});
```

### authentication(options)

#### options

 - `user` - **String** User for web basic access authentication *(default "admin")*
 - `password` - **String** Password for web basic access authentication *(default "password")*
 - `file` - **String** Path of htpasswd file *(default "disabled")*
 - `hash` - **String** Type of [hash](http://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm) inside your htpasswd file *(default "md5")*
 - `agent` - **String** Browser User Agent for web authentication *(default "all accepted")*
 - `realm` - **String** Realm for web authentication *(default "Authorization required")*
 - `ending` - **Boolean** Flag for send `res.end` (response) to client after error or wrong password (not in "functions" mode) *(default "true")*
 - `functions` - **Boolean** Flag for using module like a function *(default "false")*
 - `legacy` - **Boolean** Flag for using module like a function that return an Object *(default "false")*
 - `suppress` - **Boolean** Suppress all routing error *(default "false")*

in `functions` mode, it return a Base64 **String**; otherwise, if some errors occurred, return an Empty **String**

in `legacy` mode, it return an **Object** `{user, password}`; otherwise, if some errors occurred, return an Empty **Object**

## Examples

Take a look at my [examples](examples)

### [License GPLv3](LICENSE)

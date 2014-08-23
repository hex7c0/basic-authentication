# [basic-authentication](http://supergiovane.tk/#/basic-authentication)

[![NPM version](https://badge.fury.io/js/basic-authentication.svg)](http://badge.fury.io/js/basic-authentication)
[![Build Status](https://travis-ci.org/hex7c0/basic-authentication.svg?branch=master)](https://travis-ci.org/hex7c0/basic-authentication)
[![Dependency Status](https://david-dm.org/hex7c0/basic-authentication/status.svg)](https://david-dm.org/hex7c0/basic-authentication)

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

inside expressjs project like a callback
```js
var authentication = require('basic-authentication')();
var app = require('express')();

app.get('/',authentication,function(req,res) {
    res.send('ok');
});
```

inside routing like a function
```js
var authentication = require('basic-authentication')({functions: true});
var app = require('express')();

app.get('/',function(req,res) {
    var user = authentication(req);
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

in `functions` mode, it return a Base64 **String** otherwise, if some errors occurred, return an Empty **String**

in `legacy` mode, it return an **Object** {user, password} otherwise, if some errors occurred, return an Empty **Object**

## Examples

Take a look at my [examples](https://github.com/hex7c0/basic-authentication/tree/master/examples)

### [License GPLv3](http://opensource.org/licenses/GPL-3.0)

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.httpRequest = httpRequest;
var request = require('request');
var Q = require('q');

function httpRequest(method, url, options) {

    // Init
    var deferred = Q.defer();

    // Setup cookies
    var jar = request.jar();
    if (options && options.cookies) {
        Object.keys(options.cookies).forEach(function (cookieKey) {
            jar.setCookie(request.cookie(cookieKey + '=' + options.cookies[cookieKey]), url);
        });
    }

    // Setup request options
    var reqOptions = {};
    reqOptions.jar = jar;
    reqOptions.url = url;
    reqOptions.method = method;
    reqOptions.json = true;
    if (options && options.data) reqOptions.body = options.data;
    if (options && options.headers) reqOptions.headers = options.headers;

    // Handler
    // console.log(reqOptions.method + ' => ' + reqOptions.url);
    request(reqOptions, function (error, response, body) {
        if (error) {
            deferred.reject(error);
            return;
        }
        var cookies = {};
        (response.headers['set-cookie'] || []).forEach(function (cookieData) {
            cookieData = cookieData.substring(0, cookieData.indexOf(';'));
            cookieData = cookieData.split('=');
            cookies[cookieData[0]] = cookieData[1];
        });
        var httpResp = {
            statusCode: response.statusCode,
            headers: response.headers,
            body: body,
            cookies: cookies
        };
        deferred.resolve(httpResp);
    });

    return deferred.promise;
}
//# sourceMappingURL=httpRequest.js.map
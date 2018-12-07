import { httpRequest } from '../services/httpRequest';
var Q = require('q');
var base64 = require('base-64');

module.exports = function (payUUrlsMap, accountData) {
    var transactions = {};
    var secureHash = base64.encode(accountData.apiLogin+':'+accountData.apiKey);

    // Ping
    transactions.ping = function () {
        var deferred = Q.defer();
        httpRequest('POST', payUUrlsMap.queries, {
            headers: {
                'Authorization': 'Basic '+secureHash
            },
            data: {
                "test": accountData.test,
                "language": "en",
                "command": "PING",
                "merchant": {
                   "apiLogin": accountData.apiLogin,
                   "apiKey": accountData.apiKey
                }
            }
        }).then(function (resp) {
            if (Math.floor(resp.statusCode/100) == 2) {
                deferred.resolve(resp.body);
                return;
            }
            deferred.reject(resp);
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    return transactions;
}
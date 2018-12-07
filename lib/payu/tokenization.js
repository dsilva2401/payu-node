'use strict';

var _httpRequest = require('../services/httpRequest');

var Q = require('q');
var base64 = require('base-64');

module.exports = function (payUUrlsMap, accountData) {
    var transactions = {};
    var secureHash = base64.encode(accountData.apiLogin + ':' + accountData.apiKey);

    // Register credit card
    transactions.registerCard = function (cardData) {
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.queries, {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: {
                "test": accountData.test,
                "language": "en",
                "command": "CREATE_TOKEN",
                "merchant": {
                    "apiLogin": accountData.apiLogin,
                    "apiKey": accountData.apiKey
                },
                "creditCardToken": cardData
            }
        }).then(function (resp) {
            if (Math.floor(resp.statusCode / 100) == 2) {
                deferred.resolve(resp.body);
                return;
            }
            deferred.reject(resp);
        }).catch(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return transactions;
};
//# sourceMappingURL=tokenization.js.map
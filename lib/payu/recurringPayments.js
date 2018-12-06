'use strict';

var _httpRequest = require('../services/httpRequest');

var Q = require('q');
var base64 = require('base-64');

module.exports = function (payUUrlsMap, accountData) {
    var transactions = {};
    var secureHash = base64.encode(accountData.apiLogin + ':' + accountData.apiKey);

    // Create client
    transactions.createClient = function (data) {
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.payments + '/rest/v4.9/customers/', {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: data
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

    // Create plan
    transactions.createPlan = function (data) {
        data.accountId = accountData.accountId;
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.payments + '/rest/v4.9/plans/', {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: data
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

    // Create credit card
    transactions.createCreditCard = function (clientId, data) {
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.payments + '/rest/v4.9/customers/' + clientId + '/creditCards', {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: data
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

    // Create suscription
    transactions.createSuscription = function (data) {
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.payments + '/rest/v4.9/subscriptions/', {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: data
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

    // Get suscription data
    transactions.getSuscriptionData = function (subscriptionId) {
        var deferred = Q.defer();
        (0, _httpRequest.httpRequest)('GET', payUUrlsMap.payments + '/rest/v4.9/subscriptions/' + subscriptionId, {
            headers: {
                'Authorization': 'Basic ' + secureHash
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

    // Get bills
    transactions.getBills = function (query) {
        var deferred = Q.defer();
        var queryUrl = Object.keys(query).map(function (k) {
            return k + '=' + query[k];
        }).join('&');
        (0, _httpRequest.httpRequest)('GET', payUUrlsMap.payments + '/rest/v4.9/recurringBill?' + queryUrl, {
            headers: {
                'Authorization': 'Basic ' + secureHash
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
//# sourceMappingURL=recurringPayments.js.map
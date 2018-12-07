'use strict';

var _httpRequest = require('../services/httpRequest');

var _jsonschema = require('jsonschema');

var Q = require('q');
var base64 = require('base-64');
var md5 = require('md5');

module.exports = function (payUUrlsMap, accountData) {
    var transactions = {};
    var secureHash = base64.encode(accountData.apiLogin + ':' + accountData.apiKey);

    // Authorize and check out
    transactions.authorizeAndCheckout = function (_data) {
        var deferred = Q.defer();
        var validationResult = (0, _jsonschema.validate)(_data, {
            "type": "object",
            "title": "Authorize and checkout transaction parameters",
            "required": ["notifyUrl", "purchaseData", "personData", "cardData", "requestDeviceData"],
            "properties": {
                "notifyUrl": { "type": "string" },
                "purchaseData": {
                    "type": "object",
                    "required": ["description", "value", "currency"],
                    "properties": {
                        "description": { "type": "string" },
                        "currency": { "type": "string" },
                        "value": { "type": "string" }
                    }
                },
                "personData": {
                    "type": "object",
                    "required": ["id", "name", "lastname", "email", "phone", "legalId", "shippingAddress"],
                    "properties": {
                        "id": { "type": "string" },
                        "name": { "type": "string" },
                        "lastname": { "type": "string" },
                        "email": { "type": "string" },
                        "phone": { "type": "string" },
                        "legalId": { "type": "string" },
                        "shippingAddress": {
                            "type": "object",
                            "required": ["street", "city", "state", "countryCode", "postalCode"],
                            "properties": {
                                "street": { "type": "string" },
                                "city": { "type": "string" },
                                "state": { "type": "string" },
                                "countryCode": { "type": "string" },
                                "postalCode": { "type": "string" }
                            }
                        }
                    }
                },
                "cardData": {
                    "type": "object",
                    "required": ["number", "securityCode", "expirationDate", "name", "type", "countryCode"],
                    "properties": {
                        "number": { "type": "string" },
                        "securityCode": { "type": "string" },
                        "expirationDate": { "type": "string" },
                        "name": { "type": "string" },
                        "type": { "type": "string" },
                        "countryCode": { "type": "string" }
                    }
                },
                "requestDeviceData": {
                    "type": "object",
                    "required": ["ipAddress", "userAgent"],
                    "properties": {
                        "ipAddress": { "type": "string" },
                        "userAgent": { "type": "string" }
                    }
                }
            }
        });
        if (validationResult.errors.length) {
            throw validationResult.errors;
        }
        var data = _data;
        var referenceCode = "authorize_and_checkout_" + Math.floor(Math.random() * 10000) + '-' + Math.floor(Date.now());
        var signature = md5(accountData.apiKey + '~' + accountData.merchantId + '~' + referenceCode + '~' + data.purchaseData.value + '~' + data.purchaseData.currency);
        (0, _httpRequest.httpRequest)('POST', payUUrlsMap.payments, {
            headers: {
                'Authorization': 'Basic ' + secureHash
            },
            data: {
                "test": accountData.test,
                "language": "es",
                "command": "SUBMIT_TRANSACTION",
                "merchant": {
                    "apiLogin": accountData.apiLogin,
                    "apiKey": accountData.apiKey
                },
                "transaction": {
                    "order": {
                        "accountId": accountData.accountId,
                        "referenceCode": referenceCode,
                        "description": data.purchaseData.description,
                        "language": "es",
                        "signature": signature,
                        "notifyUrl": data.notifyUrl,
                        "additionalValues": {
                            "TX_VALUE": {
                                "value": data.purchaseData.value,
                                "currency": data.purchaseData.currency
                            }
                        },
                        "buyer": {
                            "merchantBuyerId": data.personData.id,
                            "fullName": data.personData.name + ' ' + data.personData.lastname,
                            "emailAddress": data.personData.email,
                            "contactPhone": data.personData.phone,
                            "dniNumber": data.personData.legalId,
                            "shippingAddress": {
                                "street1": data.personData.shippingAddress.street,
                                "street2": "",
                                "city": data.personData.shippingAddress.city,
                                "state": data.personData.shippingAddress.state,
                                "country": data.personData.shippingAddress.countryCode,
                                "postalCode": data.personData.shippingAddress.postalCode,
                                "phone": data.personData.phone
                            }
                        },
                        "shippingAddress": {
                            "street1": data.personData.shippingAddress.street,
                            "street2": "",
                            "city": data.personData.shippingAddress.city,
                            "state": data.personData.shippingAddress.state,
                            "country": data.personData.shippingAddress.countryCode,
                            "postalCode": data.personData.shippingAddress.postalCode,
                            "phone": data.personData.phone
                        }
                    },
                    "payer": {
                        "merchantPayerId": data.personData.id,
                        "fullName": data.personData.name + ' ' + data.personData.lastname,
                        "emailAddress": data.personData.email,
                        "contactPhone": data.personData.phone,
                        "dniNumber": data.personData.legalId,
                        "billingAddress": {
                            "street1": data.personData.shippingAddress.street,
                            "street2": "",
                            "city": data.personData.shippingAddress.city,
                            "state": data.personData.shippingAddress.state,
                            "country": data.personData.shippingAddress.countryCode,
                            "postalCode": data.personData.shippingAddress.postalCode,
                            "phone": data.personData.phone
                        }
                    },
                    "creditCard": {
                        "number": data.cardData.number,
                        "securityCode": data.cardData.securityCode,
                        "expirationDate": data.cardData.expirationDate,
                        "name": data.cardData.name || data.personData.name + ' ' + data.personData.lastname
                    },
                    "extraParameters": {
                        "INSTALLMENTS_NUMBER": 1
                    },
                    "type": "AUTHORIZATION_AND_CAPTURE",
                    "paymentMethod": data.cardData.type,
                    "paymentCountry": data.cardData.countryCode,
                    "deviceSessionId": data.requestDeviceData.sessionId || '',
                    "ipAddress": data.requestDeviceData.ipAddress,
                    "cookie": data.requestDeviceData.cookie || '',
                    "userAgent": data.requestDeviceData.userAgent
                }
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
//# sourceMappingURL=payments.js.map
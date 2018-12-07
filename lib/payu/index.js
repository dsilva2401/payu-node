'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonschema = require('jsonschema');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var recurringPayments = require('./recurringPayments');
var tools = require('./tools');
var queries = require('./queries');
var tokenization = require('./tokenization');
var payments = require('./payments');

var PayU = function () {
    function PayU(prodAccountData) {
        var _this = this;

        _classCallCheck(this, PayU);

        // Initialize instance
        this.environment = !!prodAccountData ? 'prod' : 'dev';
        this.payUUrlsMap = this.getPayUUrlsMapByEnvironment(this.environment);

        // Setup account data
        switch (this.environment) {
            case 'dev':
                this.accountData = this.getTestAccountData();
                break;
            case 'prod':
                this.validateConstructurParams(prodAccountData, function (err) {
                    if (err) {
                        throw err;
                        return;
                    }
                    _this.accountData = prodAccountData;
                });
                break;
        }
        this.accountData.test = this.environment == 'dev';

        // Setup transactions
        this.recurringPayments = recurringPayments(this.payUUrlsMap, this.accountData);
        this.tools = tools(this.payUUrlsMap, this.accountData);
        this.queries = queries(this.payUUrlsMap, this.accountData);
        this.tokenization = tokenization(this.payUUrlsMap, this.accountData);
        this.payments = payments(this.payUUrlsMap, this.accountData);
    }

    _createClass(PayU, [{
        key: 'getPayUUrlsMapByEnvironment',
        value: function getPayUUrlsMapByEnvironment(env) {
            return {
                dev: {
                    queries: 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi',
                    recurringPayments: 'https://sandbox.api.payulatam.com/payments-api',
                    payments: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
                },
                prod: {
                    queries: 'https://api.payulatam.com/reports-api/4.0/service.cgi',
                    recurringPayments: 'https://api.payulatam.com/payments-api',
                    payments: 'https://api.payulatam.com/payments-api/4.0/service.cgi'
                }
            }[env];
        }
    }, {
        key: 'getTestAccountData',
        value: function getTestAccountData() {
            return {
                apiLogin: 'pRRXKOl8ikMmt9u',
                apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
                merchantId: '508029',
                accountId: '512323'
            };
        }
    }, {
        key: 'validateConstructurParams',
        value: function validateConstructurParams(params, cb) {
            var validationResult = (0, _jsonschema.validate)(params, {
                title: 'PayU Constructor Schema',
                type: 'object',
                properties: {
                    apiLogin: { type: 'string' },
                    apiKey: { type: 'string' },
                    merchantId: { type: 'string' },
                    accountId: { type: 'string' }
                },
                required: ['apiLogin', 'apiKey', 'merchantId', 'accountId']
            });
            if (validationResult.errors.length) {
                cb(validationResult.errors);
                return;
            }
            cb();
        }
    }]);

    return PayU;
}();

module.exports = PayU;
//# sourceMappingURL=index.js.map
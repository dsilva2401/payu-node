import {validate as validateJSONSchema} from 'jsonschema';
var recurringPayments = require('./recurringPayments');
var tools = require('./tools');
var queries = require('./queries');
var tokenization = require('./tokenization');
var payments = require('./payments');

class PayU {

    constructor (prodAccountData) {

        // Initialize instance
        this.environment = (!!prodAccountData ? 'prod' : 'dev');
        this.payUUrlsMap = this.getPayUUrlsMapByEnvironment(this.environment);
        
        // Setup account data
        switch (this.environment) {
            case 'dev':
                this.accountData = this.getTestAccountData();
            break;
            case 'prod':
                this.validateConstructurParams(prodAccountData, (err) => {
                    if (err) {
                        throw err;
                        return;
                    }
                    this.accountData = prodAccountData;
                })
            break;
        }
        this.accountData.test = (this.environment == 'dev');

        // Setup transactions
        this.recurringPayments = recurringPayments(this.payUUrlsMap, this.accountData);
        this.tools = tools(this.payUUrlsMap, this.accountData);
        this.queries = queries(this.payUUrlsMap, this.accountData);
        this.tokenization = tokenization(this.payUUrlsMap, this.accountData);
        this.payments = payments(this.payUUrlsMap, this.accountData);
    }

    getPayUUrlsMapByEnvironment (env) {
        return ({
            dev: {
                queries: 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi',
                recurringPayments: 'https://sandbox.api.payulatam.com/payments-api',
                payments: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
            },
            prod: {
                queries: 'https://api.payulatam.com/reports-api/4.0/service.cgi',
                recurringPayments: 'https://api.payulatam.com/payments-api',
                payments: 'https://api.payulatam.com/payments-api/4.0/service.cgi',
            },
        })[env];
    }

    getTestAccountData () {
        return {
            apiLogin: 'pRRXKOl8ikMmt9u',
            apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
            merchantId: '508029',
            accountId: '512323',
        }
    }

    validateConstructurParams (params, cb) {
        var validationResult = validateJSONSchema(
            params, {
                title: 'PayU Constructor Schema',
                type: 'object',
                properties: {
                    apiLogin: { type: 'string' },
                    apiKey: { type: 'string' },
                    merchantId: { type: 'string' },
                    accountId: { type: 'string' },
                },
                required: ['apiLogin', 'apiKey', 'merchantId', 'accountId']
            }
        )
        if (validationResult.errors.length) {
            cb(validationResult.errors);
            return;
        }
        cb();
    }

}

module.exports = PayU;
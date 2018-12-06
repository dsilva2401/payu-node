import {validate as validateJSONSchema} from 'jsonschema';
var recurringPayments = require('./recurringPayments');

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

        // Setup transactions
        this.recurringPayments = recurringPayments(this.payUUrlsMap, this.accountData);
    }

    getPayUUrlsMapByEnvironment (env) {
        return ({
            dev: {
                queries: 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi',
                payments: 'https://sandbox.api.payulatam.com/payments-api',
            },
            prod: {
                queries: 'https://api.payulatam.com/reports-api/4.0/service.cgi',
                payments: 'https://api.payulatam.com/payments-api',
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
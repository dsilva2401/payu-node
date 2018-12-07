// Imports
var expect = require('chai').expect;
var data = require('./data');
var PayU = require('..');

// Setup variables
var payU = new PayU();
var sharedData = {};

/**
 * Transactions
 */

describe('Recurring payments', function () {

    it('Create plan', function (done) {
        payU.recurringPayments.createPlan(
            data.planData()
        ).then(function (planData) {
            sharedData.planData = planData;
            done();
        }).catch(function (err) { throw err });
    });

    it('Create client', function (done) {
        payU.recurringPayments.createClient(
            data.clientData()
        ).then(function (clientData) {
            sharedData.clientData = clientData;
            done();
        }).catch(function (err) { throw err });
    });

    it('Create credit card', function (done) {
        payU.recurringPayments.createCreditCard(
            sharedData.clientData.id,
            data.cardData(sharedData.clientData)
        ).then(function (cardData) {
            sharedData.cardData = cardData;
            done();
        }).catch(function (err) { throw err });
    });

    it('Create suscription', function (done) {
        payU.recurringPayments.createSuscription(
            data.suscriptionData(
                sharedData.clientData,
                sharedData.cardData,
                sharedData.planData
            )
        ).then(function (suscriptionData) {
            sharedData.suscriptionData = suscriptionData;
            done();
        }).catch(function (err) { throw err });
    });

    it('Get bills by suscription id', function (done) {
        payU.recurringPayments.getBills({
            suscriptionId: sharedData.suscriptionData.id
        }).then(function (billsData) {
            sharedData.billsData = billsData;
            done();
        }).catch(function (err) { throw err });
    });

});

describe('Tools', function () {

    it('Ping payu server', function (done) {
        payU.tools.ping().then(function () {
            done();
        }).catch(function (err) { throw err });
    });

});

describe('Payments', function () {

    it('Authorize and checkout', function (done) {
        payU.payments.authorizeAndCheckout(
            data.authorizeAndCheckoutData()
        ).then(function (r) {
            done();
        }).catch(function (err) { throw err });
    });

});
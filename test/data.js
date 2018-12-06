
/**
 * Plan data
 */
    exports.planData = function () { return {
        "planCode": "samplesad-plan-code-0"+Math.floor(Math.random()*100000),
        "description": "Sample Plan 001",
        "interval": "MONTH",
        "intervalCount": "1",
        "maxPaymentsAllowed": "12",
        "paymentAttemptsDelay": "1",
        "additionalValues": [
            {
                "name": "PLAN_VALUE",
                "value": "4",
                "currency": "USD"
            },
            {
                "name": "PLAN_TAX",
                "value": "3193",
                "currency": "USD"
            },
            {
                "name": "PLAN_TAX_RETURN_BASE",
                "value": "16806",
                "currency": "USD"
            }
        ]
    }}

/**
 * Card data
 */
    exports.cardData = function (clientData) { return {
        "name": clientData.fullName,
        "document": "1020304050",
        "number": "4242424242424242",
        "expMonth": "01",
        "expYear": "2020",
        "type": "VISA",
        "address": {
           "line1": "Address Name",
           "line2": "17 25",
           "line3": "Of 301",
           "postalCode": "00000",
           "city": "City Name",
           "state": "State Name",
           "country": "CO",
           "phone": "300300300"
        }
    }}

/**
 * Client data
 */
    exports.clientData = function () { return {
        fullName: 'Carloz Perez',
        email: 'cperez@screensads.com'
    }}

/**
 * Suscription data
 */
    exports.suscriptionData = function (
        clientData, cardData, planData
    ) { return {
        "quantity": "1",
        "installments": "1",
        "trialDays": "0",
        "customer": {
            "id": clientData.id,
            "creditCards": [
                {
                    "token": cardData.token
                }
            ]
        },
        "plan": {
            "planCode": planData.planCode
        }
    }}
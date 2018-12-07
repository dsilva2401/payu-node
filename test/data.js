
/**
 * Plan data
 */
    exports.planData = function () { return {
        "planCode": "plan-code-0"+Math.floor(Math.random()*100000000),
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
 * Card data for tokenization
 */
    exports.cardDataForTokenization = function (clientData) { return {
        "name": clientData.fullName,
        "payerId": clientData.id,
        "document": "1020304050",
        "identificationNumber": "32144457",
        "paymentMethod": "VISA",
        "number": "4111111111111111",
        "expirationDate": "2017/01"
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

/**
 * Authorize and pay data
 */
    exports.authorizeAndCheckoutData = function () { return {
        notifyUrl: 'http://www.screensads.com/test/confirmation',
        purchaseData: {
            description: 'Test puchase',
            value: '1000',
            currency: 'PEN'
        },
        personData: {
            id: Math.floor(Math.random()*1000000)+'',
            name: 'Carlos',
            lastname: 'Perez',
            email: 'cpz@test.test',
            phone: '999999',
            legalId: '768768876',
            shippingAddress: {
                street: "Avenida de la poesia",
                city: "Cuzco",
                state: "CU",
                countryCode: "PE",
                postalCode: "000000"
            }
        },
        cardData: {
            number: "4907840000000005",
            securityCode: "321",
            expirationDate: "2019/12",
            name: "ACCEPTED",
            type: 'VISA',
            countryCode: 'PE'
        },
        requestDeviceData: {
            sessionId: "vghs6tvkcle931686k1900o6e1",
            ipAddress: "127.0.0.1",
            cookie: "pt1t38347bs6jc9ruv2ecpv7o2",
            userAgent: "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
        }
    }}
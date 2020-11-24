import { encodeToken } from './utils'

const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'firstStep':
            return firstStep
        case 'email':
            return emailStep
        case 'verifyEmail':
            return verifyEmailStep
        case 'identity':
            return personalInfoStep
        case 'pickOne':
            return pickOneStep
        case 'passport':
        case 'national_identity_card':
        case 'residence_permit':
        case 'driving_licence':
            return uploadStep
        case 'registerBank':
            return bankStep
    }
}

const firstStep = {
    "type": "form",
    "url": "https://api.onramper.dev/transaction/Moonpay/email/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
    "data": [
        {
            "type": "string",
            "name": "email",
            "humanName": "Email",
            "hint": "We will send a code to your email."
        },
        {
            "type": "string",
            "name": "cryptocurrencyAddress",
            "humanName": "Cryptocurrency wallet address"
        }
    ]
}

const emailStep = {
    "type": "form",
    "url": `https://api.onramper.dev/transaction/Moonpay/verifyEmail/${encodeToken(["", ""])}`,
    "data": [
        {
            "type": "string",
            "name": "email",
            "humanName": "Email",
            "hint": "You can also find the payment info in your email."
        },
        {
            "type": "string",
            "name": "cryptocurrencyAddress",
            "humanName": "Cryptocurrency wallet address"
        }
    ]
}

const verifyEmailStep = {
    "type": "form",
    "url": "https://api.onramper.dev/transaction/Moonpay/identity/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
    "data": [
        {
            "type": "string",
            "name": "verifyEmailCode",
            "humanName": "Email verification code"
        },
        {
            "type": "boolean",
            "name": "termsOfUse",
            "terms": [
                {
                    "url": "https://onramper.com/terms-of-use/",
                    "humanName": "Onramper's Terms Of Use"
                },
                {
                    "url": "https://onramper.com/privacy-policy/",
                    "humanName": "Onramper's Privacy Policy"
                },
                {
                    "url": "https://moonpay.io/terms_of_use/",
                    "humanName": "Moonpay's Terms Of Use"
                },
                {
                    "url": "https://moonpay.io/privacy_policy/",
                    "humanName": "Moonpay's Privacy Policy"
                }
            ]
        }
    ]
}

const personalInfoStep = {
    "type": "form",
    "url": "https://api.onramper.dev/transaction/Moonpay/pickOne/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
    "data": [
        {
            "type": "string",
            "name": "firstName",
            "humanName": "First name"
        },
        {
            "type": "string",
            "name": "lastName",
            "humanName": "Last Name"
        },
        {
            "type": "string",
            "name": "street",
            "humanName": "Street"
        },
        {
            "type": "string",
            "name": "town",
            "humanName": "City"
        },
        {
            "type": "string",
            "name": "postCode",
            "humanName": "Postal Code"
        },
        {
            "type": "string",
            "name": "country",
            "humanName": "Country"
        },
        {
            "type": "date",
            "name": "dateOfBirth",
            "humanName": "Date of Birth",
            "data": [
                {
                    "type": "integer",
                    "humanName": "Day",
                    "name": "day"
                },
                {
                    "type": "integer",
                    "humanName": "Month",
                    "name": "month"
                },
                {
                    "type": "integer",
                    "humanName": "Year",
                    "name": "year"
                }
            ]
        }
    ]
}

const pickOneStep = {
    "type": "pickOne",
    "options": [
        {
            "type": "file",
            "humanName": "Passport - Front",
            "url": "https://api.onramper.dev/transaction/Moonpay/passport/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "Driver's License - Front",
            "url": "https://api.onramper.dev/transaction/Moonpay/national_identity_card/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "National Identity Card - Front",
            "url": "https://api.onramper.dev/transaction/Moonpay/residence_permit/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "Residence Card - Front",
            "url": "https://api.onramper.dev/transaction/Moonpay/driving_licence/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        }
    ]
}

const uploadStep = {
    "type": "file",
    "humanName": "Selfie",
    "url": "https://api.onramper.dev/transaction/Moonpay/registerBank/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd",
    "acceptedContentTypes": [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ]
}

const bankStep = {
    "type": "requestBankTransaction",
    "depositBankAccount": {
        "iban": "ZZ135790000087654321",
        "bic": "ABCDZZ21XXX",
        "bankName": "Cosmic Bank",
        "bankAddress": "123 Luna Lane, London LL1 1LL, United Kingdom",
        "accountName": "Moon Pay Limited",
        "accountAddress": "Triq l-Uqija, Swieqi SWQ 2332, Malta"
    },
    "reference": "jTxDd17ATQ",
    "hint": "Transfer 100$ into the bank account provided to complete the transaction. Your transaction must cite the reference jTxDd17ATQ to be valid. We sent this data to your email."
}

export default {
    getNextStep
}
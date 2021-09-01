import { encodeToken } from './utils'
import { BASE_API } from '../../../constants'

const getNextStep = (currentStep: string) => {
    switch (currentStep) {
        case 'firstStep':
            return firstStep
        case 'email':
            return verifyEmailStep
        case 'verifyEmail':
            return emailStep
        case 'identity':
            return personalInfoStep
        case 'pickOne':
            return pickOneStep
        case 'passport':
        case 'national_identity_card':
        case 'residence_permit':
        case 'driving_licence':
        case 'selfie':
            return uploadStep(getDocumentHumanName(currentStep))
        case 'payment':
            return paymentStep
        case 'completed':
            return completedStep
    }
}

const firstStep = {
    "type": "form",
    "url": `${BASE_API}/transaction/Moonpay/email/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
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
    "type": "redirect",
    "url": `${BASE_API}/transaction/Moonpay/verifyEmail/${encodeToken(["", ""])}`,
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
    "url": `${BASE_API}/transaction/Moonpay/identity/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
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
    "url": `${BASE_API}/transaction/Moonpay/pickOne/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
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
            "url": `${BASE_API}/transaction/Moonpay/passport/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "Driver's License - Front",
            "url": `${BASE_API}/transaction/Moonpay/national_identity_card/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "National Identity Card - Front",
            "url": `${BASE_API}/transaction/Moonpay/residence_permit/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        },
        {
            "type": "file",
            "humanName": "Residence Card - Front",
            "url": `${BASE_API}/transaction/Moonpay/driving_licence/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
            "acceptedContentTypes": [
                "image/jpeg",
                "image/png",
                "application/pdf"
            ]
        }
    ]
}

const uploadStep = (fileName: string) => ({
    "type": "file",
    "humanName": fileName + (fileName === 'Selfie' ? '' : " - Back"),
    "url": `${BASE_API}/transaction/Moonpay/${fileName === 'Selfie' ? 'payment' : 'selfie'}/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
    "acceptedContentTypes": [
        "image/jpeg",
        "image/png",
        "application/pdf"
    ]
})

const paymentStep = {
    "type": "form",
    "url": `${BASE_API}/transaction/Moonpay/completed/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
    "humanName": "Complete payment",
    "hint": "Complete your payment. The form below is in a secure sandbox.",
    "data": [
        {
            type: "string",
            name: "ccNumber",
            humanName: "Credit Card Number",
          },
          {
            type: "string",
            name: "ccMonth",
            humanName: "Credit Card Expiration Month",
          },
          {
            type: "string",
            name: "ccYear",
            humanName: "Credit Card Expiration Year",
          },
          {
            type: "string",
            name: "ccCVV",
            humanName: "Credit Card CVV",
          },
    ]
}

const completedStep = {
    "type": "completed"
}

const getDocumentHumanName = (doc: string) => {
    switch (doc) {
        case 'passport':
            return 'Passport';
        case 'national_identity_card':
            return 'National Identity Card';
        case 'residence_permit':
            return 'Residence Card';
        case 'driving_licence':
            return "Driver's License";
        case 'selfie':
            return "Selfie";
        default:
            return '';
    }
}

export default {
    getNextStep
}
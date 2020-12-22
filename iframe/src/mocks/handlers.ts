import { rest } from 'msw'
//import { gatewaysAllParams, noGatewaysAllParams } from './responses/gateways'
import ratesAllParams from './responses/rates'
import CCPro from './responses/steps/Cryptocoin.pro'
import Moonpay from './responses/steps/Moonpay'
import Wyre from './responses/steps/Wyre'


const BASE_API = 'https://api.onramper.dev'

let moonpayKYCStepsCount = 0

export const handlers = [
    /* rest.get(`${BASE_API}/gateways`, (req, res, ctx) => {
        let response = gatewaysAllParams
        if (req.url.searchParams.get('includeIcons') !== 'true')
            delete response.icons
        if (req.url.searchParams.get('includeDefaultAmounts') !== 'true')
            delete response.defaultAmounts

        const RESPONSE_CODE: number = 200
        if (RESPONSE_CODE === 200)
            return res(
                // Respond with a 200 status code
                ctx.status(200),
                ctx.json(response)
            )
        else if (RESPONSE_CODE === 403)
            return res(
                // Respond with a 200 status code
                ctx.status(403),
                ctx.json({ message: "'Authorization' header was no provided." })
            )
    }), */
    rest.get(`${BASE_API}/rate/*`, (req, res, ctx) => {
        const RESPONSE_CODE: number = 200
        if (RESPONSE_CODE === 200)
            return res(
                // Respond with a 200 status code
                ctx.status(200),
                ctx.json(ratesAllParams)
            )
    }),
    rest.post(`${BASE_API}/transaction/*`, async (req, res, ctx) => {
        const gateway = req.url.pathname.split('/')[2]
        const currentStep = req.url.pathname.split('/')[3]
        let nextStep
        switch (gateway) {
            case 'Cryptocoin.pro':
                nextStep = CCPro.getNextStep(currentStep)
                break
            case 'Moonpay':
                nextStep = Moonpay.getNextStep(currentStep) // used for demo purposes, not real behavior of moonpay
                break
            case 'Wyre':
                nextStep = Wyre.getNextStep(currentStep)
                break
            default:
                nextStep = { type: 'completed' }
                break
        }

        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json(nextStep)
        )
    }),
    rest.put(`${BASE_API}/transaction/*`, async (req, res, ctx) => {
        const gateway = req.url.pathname.split('/')[2]
        const currentStep = req.url.pathname.split('/')[3]
        let nextStep
        switch (gateway) {
            case 'Moonpay':
                nextStep = Moonpay.getNextStep(currentStep) // used for demo purposes, not real behavior of moonpay
                break
            default:
                nextStep = { type: 'completed' }
                break
        }

        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json(nextStep)
        )
    }),
    rest.get(`https://api.onramper.com/partner/fees`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json({ "onramper": 1, "partner": 0, "total": 1 })
        )
    }),
    rest.post<{ securityCode: string, email: string }>(/^(https:\/\/api\.moonpay\.io\/v3\/customers\/email_login)(\/?\?{0}|\/?\?{1}.*)$/g, async (req, res, ctx) => {
        let response
        if (req.body.securityCode)
            response = { "csrfToken": "9jyP7ReLfu3dNYpQBSLK6y43Oqr1xHlv", "customer": { "id": "ca1c1140-148b-4d8f-b195-f73e0530c552", "createdAt": "2020-11-20T01:39:19.390Z", "updatedAt": "2020-11-24T11:36:38.034Z", "firstName": "sdf", "lastName": "sdf", "email": "yejenas966@opetron.com", "walletAddress": null, "phoneNumber": null, "isPhoneNumberVerified": false, "dateOfBirth": "1966-02-20T00:00:00.000Z", "liveMode": true, "defaultCurrencyId": "71435a8d-211c-4664-a59e-2a5361a6c5a7", "address": { "street": "dsf", "subStreet": null, "town": "sdf", "postCode": "065465", "state": null, "country": "ESP" } } }
        else if (req.body.email)
            response = { "preAuthenticated": true, "showTermsOfUse": true }
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json(response)
        )
    }),
    rest.patch(`https://api.moonpay.io/v3/customers/me`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json({ "id": "ca1c1140-148b-4d8f-b195-f73e0530c552", "createdAt": "2020-11-20T01:39:19.390Z", "updatedAt": "2020-11-24T11:36:38.034Z", "firstName": "sdf", "lastName": "sdf", "email": "yejenas966@opetron.com", "walletAddress": null, "phoneNumber": null, "isPhoneNumberVerified": false, "dateOfBirth": "1966-02-20T00:00:00.000Z", "liveMode": true, "defaultCurrencyId": "71435a8d-211c-4664-a59e-2a5361a6c5a7", "address": { "street": "dsf", "subStreet": null, "town": "sdf", "postCode": "065465", "state": null, "country": "ESP" } })
        )
    }),
    rest.get(`https://api.moonpay.io/v3/customers/me/limits`, async (req, res, ctx) => {
        moonpayKYCStepsCount++
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json({
                "limits": [
                    {
                        "type": "buy_credit_debit_card",
                        "dailyLimit": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "dailyLimitRemaining": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "monthlyLimit": moonpayKYCStepsCount > 2 ? 15000000 : 150,
                        "monthlyLimitRemaining": moonpayKYCStepsCount > 2 ? 15000000 : 150
                    },
                    {
                        "type": "buy_gbp_bank_transfer",
                        "dailyLimit": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "dailyLimitRemaining": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "monthlyLimit": moonpayKYCStepsCount > 2 ? 15000000 : 150,
                        "monthlyLimitRemaining": moonpayKYCStepsCount > 2 ? 15000000 : 150
                    },
                    {
                        "type": "buy_sepa_bank_transfer",
                        "dailyLimit": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "dailyLimitRemaining": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "monthlyLimit": moonpayKYCStepsCount > 2 ? 15000000 : 150,
                        "monthlyLimitRemaining": moonpayKYCStepsCount > 2 ? 15000000 : 150
                    },
                    {
                        "type": "sell_gbp_bank_transfer",
                        "dailyLimit": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "dailyLimitRemaining": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "monthlyLimit": moonpayKYCStepsCount > 2 ? 15000000 : 150,
                        "monthlyLimitRemaining": moonpayKYCStepsCount > 2 ? 15000000 : 150
                    },
                    {
                        "type": "sell_sepa_bank_transfer",
                        "dailyLimit": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "dailyLimitRemaining": moonpayKYCStepsCount > 2 ? 5000000 : 50,
                        "monthlyLimit": moonpayKYCStepsCount > 2 ? 15000000 : 150,
                        "monthlyLimitRemaining": moonpayKYCStepsCount > 2 ? 15000000 : 150
                    }
                ],
                "verificationLevels": [
                    {
                        "name": "Level 1",
                        "requirements": [
                            {
                                "completed": true,
                                "identifier": "identity_verification"
                            }
                        ],
                        "completed": true
                    },
                    {
                        "name": "Level 2",
                        "requirements": [
                            {
                                "completed": moonpayKYCStepsCount > 1,
                                "identifier": "document_verification"
                            },
                            {
                                "completed": moonpayKYCStepsCount > 2,
                                "identifier": "face_match_verification",
                                "showLivenessCheck": false
                            }
                        ],
                        "completed": moonpayKYCStepsCount > 2
                    },
                    {
                        "name": "Level 3",
                        "requirements": [
                            {
                                "completed": moonpayKYCStepsCount > 3,
                                "identifier": "address_verification"
                            }
                        ],
                        "completed": moonpayKYCStepsCount > 3
                    }
                ],
                "limitIncreaseEligible": true
            })
        )
    }),
    rest.post(`https://api.moonpay.io/v3/files`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200)
        )
    }),
    rest.get(`https://api.moonpay.io/v3/files/*`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json({ "key": "fe6fba4f-cf26-482f-a05b-7a861f886c4b", "signedRequest": "https://moonpay-documents.s3-accelerate.amazonaws.com/fe6fba4f-cf26-482f-a05b-7a861f886c4b?AWSAccessKeyId=AKIATXOOZY3A25LUDLWI&Content-Type=image%2Fpng&Expires=1606218560&Signature=d8kecCb3PcfSWYj1fGtXMdDUPXA%3D&x-amz-server-side-encryption=AES256" })
        )
    }),
    rest.put(`https://moonpay-documents.s3-accelerate.amazonaws.com/*`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200)
        )
    }),
    rest.post(`https://api.moonpay.io/v3/transactions`, async (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),
            ctx.json({ type: "completed" })
        )
    })
]
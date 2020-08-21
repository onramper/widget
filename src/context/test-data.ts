const response_gateways = {
    "gateways": [
        {
            "paymentMethods": [
                "creditCard",
                "bankTransfer"
            ],
            "fiatCurrencies": [
                {
                    "code": "EUR",
                    "precision": 2
                }
            ],
            "cryptoCurrencies": [
                {
                    "code": "BTC",
                    "precision": 5
                },
                {
                    "code": "ETH",
                    "precision": 5
                }
            ]
        }
    ],
    "localization": {
        "country": "es",
        "state": null,
        "currency": "EUR"
    }
}

const response_gateways_empty = {
    "gateways": [],
    "localization": {
        "country": "es",
        "state": null,
        "currency": "EUR"
    }
}

const response_rate = [
    {
        "identifier": "CryptoCoin.pro",
        "requiredKYC": [
            "email",
            "phone"
        ],
        "duration": "~15 hours",
        "rate": 8118.0099,
        "available": true,
        "fees": 4,
        "receivedCrypto": 0.00739,
        "nextStep": {
            "url": "https://api.onramper.dev/transaction/CryptoCoin.pro/email",
            "data": [
                "email"
            ]
        }
    },
    {
        "identifier": "Moonpay",
        "requiredKYC": [
            "email",
            "phone"
        ],
        "duration": "~15 hours",
        "rate": 8118.0099,
        "available": false,
        "fees": 40,
        "receivedCrypto": 0.00739,
        "nextStep": {
            "url": "https://api.onramper.dev/transaction/CryptoCoin.pro/email",
            "data": [
                "email"
            ]
        }
    }
]

export {
    response_gateways,
    response_rate,
    response_gateways_empty
}
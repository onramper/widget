/* eslint quote-props: off */
const gateways = async () => {
    return {
        "gateways": [
            {
                "paymentMethods": [
                    "creditCard",
                    "bankTransfer"
                ],
                "supportedCurrencies": [
                    "EUR"
                ],
                "supportedCrypto": [
                    "BTC",
                    "ETH"
                ]
            },
            {
                "paymentMethods": [
                    "creditCard",
                    "bankTransfer",
                    "applePay",
                    "googlePay"
                ],
                "supportedCurrencies": [
                    "AUD",
                    "CAD",
                    "EUR",
                    "ILS",
                    "NOK",
                    "PLN",
                    "GBP",
                    "RUB",
                    "ZAR",
                    "SEK",
                    "CHF",
                    "USD"
                ],
                "supportedCrypto": [
                    "BAT",
                    "BNB",
                    "BTC",
                    "BCH",
                    "ADA",
                    "CHZ",
                    "CVC",
                    "ATOM",
                    "DAI",
                    "DASH",
                    "MANA",
                    "EOS",
                    "EOSDT",
                    "ETH",
                    "ETC",
                    "FUN",
                    "HBAR",
                    "HIVE",
                    "USDH",
                    "MIOTA",
                    "KAVA",
                    "LTC",
                    "LUNA",
                    "NANO",
                    "NEO",
                    "ONT",
                    "ONG",
                    "PAX",
                    "QTUM",
                    "RVN",
                    "SPICE",
                    "XLM",
                    "SDT",
                    "USDT",
                    "XTZ",
                    "TRX",
                    "TUSD",
                    "USDC",
                    "VET",
                    "WAVES",
                    "XRP",
                    "ZEC",
                    "ZIL",
                    "ZRX"
                ]
            }
        ],
        "country": "es"
    }
}

const rate = async () => {
    return [
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
}

export {
    gateways,
    rate
}

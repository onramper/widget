import IconBTC from '../icons/btc.svg'
import IconNEO from '../icons/neoicon.png'
import IconGAS from '../icons/gasicon.png'

import IconUSD from '../icons/usd.svg'
import IconEUR from '../icons/euroicon.png'
import IconGBP from '../icons/poundicon.png'

import IconCC from '../icons/ccs.svg'
import IconBank from '../icons/bankicon.png'

import LogoMoonPay from '../icons/moonpay.svg'
import LogoCryptoCoinPro from '../icons/cryptocoinpro.png'

const calculateExpectedCrypto = (amount: number, rate: number, fee: number) => {
    let amount2Get = amount / rate
    return Math.round((amount2Get - amount2Get * fee / 100) * 1e6) / 1e6
}

const getExpectedCrypto = async (amount: number) => {
    /* await new Promise(resolve => setTimeout(resolve, 1500)); */
    return amount * 0.0001079
}

const getData = async () => {
    return {
        availableCryptos: [
            {
                icon: IconNEO,
                name: "NEO",
                info: "Neo"
            },
            {
                icon: IconBTC,
                name: "BTC",
                info: "Bitcoin"
            },
            {
                icon: IconGAS,
                name: "GAS",
                info: "Gas (Neo)"
            },
        ],
        availableCurrencies: [
            {
                icon: IconUSD,
                name: "USD",
                info: "US Dollar",
                symbol: '$'
            },
            {
                icon: IconEUR,
                name: "EUR",
                info: "Euro",
                symbol: '€'
            },
            {
                icon: IconGBP,
                name: "GBP",
                info: "Pound sterling",
                symbol: '£'
            }
        ],
        availablePaymentMethods: [
            {
                icon: IconCC,
                name: "Credit card"
            },
            {
                icon: IconBank,
                name: "Bank account"
            }
        ],
        availableGateways: [
            {
                name: "Recommended",
                txTime: "3-5h",
                kycLevel: "hard",
                rate: 10.73,
                fee: 2,
                logo: LogoCryptoCoinPro
            },
            {
                name: "Fastest",
                txTime: "1-2h",
                kycLevel: "medium",
                rate: 10.76,
                fee: 4,
                logo: LogoMoonPay
            }
        ]
    }
}

export {
    getExpectedCrypto,
    getData,
    calculateExpectedCrypto
}
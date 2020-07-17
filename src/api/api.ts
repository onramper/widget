/* import IconBTC from '../icons/btc.svg'
import IconNEO from '../icons/neoicon.png'
import IconGAS from '../icons/gasicon.png'

import IconUSD from '../icons/usd.svg'
import IconEUR from '../icons/euroicon.png'
import IconGBP from '../icons/poundicon.png'

import IconCC from '../icons/ccs.svg'
import IconBank from '../icons/bankicon.png'

import LogoMoonPay from '../icons/moonpay.svg'
import LogoCryptoCoinPro from '../icons/cryptocoinpro.png' */

const BASE_API = 'https://api.onramper.dev'

const calculateExpectedCrypto = (amount: number, rate: number, fee: number) => {
    let amountcrypto = amount / rate
    let amount2get = Math.round((amountcrypto) * 1e6) / 1e6
    return !isFinite(amount2get) ? 0 : amount2get
}

const getExpectedCrypto = async (amount: number) => {
    /* await new Promise(resolve => setTimeout(resolve, 1500)); */
    return amount * 0.0001079
}

const getData = async () => {
    return { "gateways": [{ "paymentMethods": ["creditCard", "bankTransfer"], "supportedCurrencies": ["EUR"], "supportedCrypto": ["BTC", "ETH"] }, { "paymentMethods": ["creditCard", "bankTransfer", "applePay", "googlePay"], "supportedCurrencies": ["AUD", "CAD", "EUR", "ILS", "NOK", "PLN", "GBP", "RUB", "ZAR", "SEK", "CHF", "USD"], "supportedCrypto": ["BAT", "BNB", "BTC", "BCH", "ADA", "CHZ", "CVC", "ATOM", "DAI", "DASH", "MANA", "EOS", "EOSDT", "ETH", "ETC", "FUN", "HBAR", "HIVE", "USDH", "MIOTA", "KAVA", "LTC", "LUNA", "NANO", "NEO", "ONT", "ONG", "PAX", "QTUM", "RVN", "SPICE", "XLM", "SDT", "USDT", "XTZ", "TRX", "TUSD", "USDC", "VET", "WAVES", "XRP", "ZEC", "ZIL", "ZRX"] }], "country": "es" }
}

const gateways = async (country?: string) => {
    const endpoint = country ? `/gateways?country=${country}` : '/gateways'
    const gateways = await fetch(`${BASE_API}${endpoint}`).then(res => res.json())
    return gateways
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string) => {
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${amount}/${paymentMethod}`).then(res => res.json())
    return gateways
}

export {
    getExpectedCrypto,
    getData,
    gateways,
    rate,
    calculateExpectedCrypto
}

window.opener = {
    getExpectedCrypto,
    getData,
    gateways,
    rate,
    calculateExpectedCrypto
}
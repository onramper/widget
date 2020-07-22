const BASE_API = 'https://api.onramper.dev'

/**
 * Remote calls
 */
const gateways = async (country?: string) => {
    const endpoint = country ? `/gateways?country=${country}` : '/gateways'
    const gateways = await fetch(`${BASE_API}${endpoint}`).then(res => res.json())
    return gateways
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string) => {
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${amount}/${paymentMethod}`).then(res => res.json())
    return gateways
}


/**
 * 
 */
const calculateExpectedCrypto = (amount: number, rate: number) => {
    console.log(amount, rate)
    let amountcrypto = amount / rate
    let amount2get = Math.round((amountcrypto) * 1e6) / 1e6
    return !isFinite(amount2get) ? 0 : amount2get
}

export {
    gateways,
    rate,
    calculateExpectedCrypto
}

window.opener = {
    gateways,
    rate,
    calculateExpectedCrypto
}
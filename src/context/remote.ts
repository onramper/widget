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

export {
    gateways,
    rate
}
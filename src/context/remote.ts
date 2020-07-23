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
 * Remote calls - steps
 */
const email = async (url: string, email: string) => {
    const nextStep = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
    return nextStep
}

export {
    gateways,
    rate,
    email
}

window.opener = { email, gateways }
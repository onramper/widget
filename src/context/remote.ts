const BASE_API = 'https://api.onramper.dev'

/**
 * Remote calls
 */
type gatewaysParams = {
    country?: string
    includeIcons?: boolean
    [key: string]: any
}

const gateways = async (params: gatewaysParams) => {
    const endpoint = '/gateways'
    const urlParams = createUrlParamsFromObject(params)
    const gateways = await fetch(`${BASE_API}${endpoint}${urlParams}`).then(res => res.json())
    return gateways
}

type rateParams = {
    amountInCrypto?: boolean
    [key: string]: any
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string, params?: rateParams) => {
    const urlParams = createUrlParamsFromObject(params ?? {})
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}${urlParams}`).then(res => res.json())
    return gateways
}

/**
 * Remote calls - steps
 */
const email = async (url: string, email: string) => {
    const nextStep = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ email })
    }).then(res => res.json()).catch(() => undefined)
    console.log(nextStep)
    return nextStep
}

export {
    gateways,
    rate,
    email
}

window.opener = { ...window.opener, email, gateways }

const createUrlParamsFromObject = (paramsObj: { [key: string]: any }) =>
    Object.keys(paramsObj).reduce((acc, current, i, arr) => {
        if (paramsObj[current] !== undefined) {
            if (!acc) acc += '?'
            acc += `${current}=${paramsObj[current]}`
            if (i < arr.length - 1) acc += '&'
            return acc
        }
        return ''
    }, '')
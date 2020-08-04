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
    const gateways = await fetch(`${BASE_API}${endpoint}${urlParams}`)
    return processResponse(gateways)
}

type rateParams = {
    amountInCrypto?: boolean
    [key: string]: any
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string, params?: rateParams, signal?: AbortSignal) => {
    const urlParams = createUrlParamsFromObject(params ?? {})
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}${urlParams}`, { signal })
    return processResponse(gateways)
}

/**
 * Exectue step
 */
const executeStep = async (url: string, data: { [key: string]: any }) => {
    const nextStep = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ ...data })
    })
    return processResponse(nextStep)
}

const processResponse = async (response: Response) => {
    if (response.status === 200)
        return response.json()
    else if (response.status >= 500)
        throw new Error(await response.text())
    else if (response.status >= 400)
        throw new Error("Connection error, try again later.")
    else
        throw new Error("Unknown error, try again later.")
}

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


export {
    gateways,
    rate,
    executeStep
}
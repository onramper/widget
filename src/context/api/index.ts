import { RateResponse } from './types/rate'
import { GatewaysResponse } from './types/gateways'
import { NextStep } from '../../common/types'

const BASE_API = 'https://api.onramper.dev'

/**
 * Remote calls
 */
type gatewaysParams = {
    country?: string
    includeIcons?: boolean
    [key: string]: any
}

const gateways = async (params: gatewaysParams): Promise<GatewaysResponse> => {
    const endpoint = '/gateways'
    const urlParams = createUrlParamsFromObject(params)
    const gateways = await fetch(`${BASE_API}${endpoint}${urlParams}`)
    return processResponse(gateways)
}

type rateParams = {
    amountInCrypto?: boolean
    [key: string]: any
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string, params?: rateParams, signal?: AbortSignal): Promise<RateResponse> => {
    const urlParams = createUrlParamsFromObject(params ?? {})
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}${urlParams}`, { signal })
    return processResponse(gateways)
}

/**
 * Exectue step
 */
const executeStep = async (step: NextStep, data: { [key: string]: any } | File) => {

    const { url = '' } = step
    const method = step.type === 'file' ? 'PUT' : 'POST'
    const body = step.type === 'file' ? data as File : JSON.stringify({ ...data })

    const nextStep = await fetch(url, { method, body })
    return processResponse(nextStep)
}

const processResponse = async (response: Response) => {
    if (response.status === 200)
        return response.json()
    else if (response.status >= 500)
        throw new Error(await response.text())
    else if (response.status >= 400)
        throw new Error("Connection error.")
    else
        throw new Error("Unknown error.")
}

const createUrlParamsFromObject = (paramsObj: { [key: string]: any }) =>
    Object.keys(paramsObj).reduce((acc, current, i, arr) => {
        if (paramsObj[current] !== undefined) {
            if (!acc) acc += '?'
            acc += `${current}=${paramsObj[current]}`
            if (i < arr.length - 1) acc += '&'
            return acc
        }
        return acc
    }, '')


export {
    gateways,
    rate,
    executeStep
}
import { RateResponse } from './types/rate'
import { GatewaysResponse } from './types/gateways'
import { FieldError } from './types/nextStep'
import { NextStep } from '../../context'

const BASE_API = 'https://api.onramper.dev'

/**
 * API calls
 */
interface GatewaysParams {
    country?: string
    includeIcons?: boolean
    includeDefaultAmounts?: boolean
    [key: string]: any
}

const gateways = async (params: GatewaysParams, filter?: Filters): Promise<GatewaysResponse> => {
    const urlParams = createUrlParamsFromObject(params)
    const gateways_res = await fetch(`${BASE_API}/gateways?${urlParams}`)
    const gateways: GatewaysResponse = await processResponse(gateways_res)
    return filterGatewaysResponse(gateways, filter ?? {})
}

interface RateParams {
    country?: string
    amountInCrypto?: boolean
    [key: string]: any
}

const rate = async (currency: string, crypto: string, amount: number, paymentMethod: string, params?: RateParams, signal?: AbortSignal): Promise<RateResponse> => {
    const urlParams = createUrlParamsFromObject(params ?? {})
    const gateways = await fetch(`${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}?${urlParams}`, { signal })
    return processResponse(gateways)
}

/**
 * Exectue step
 */
interface ExecuteStepParams {
    country?: string
    amountInCrypto?: boolean
    [key: string]: any
}

const executeStep = async (step: NextStep, data: { [key: string]: any } | File, params?: ExecuteStepParams): Promise<NextStep> => {
    if (!step.url) throw new Error('Unexpected error: Invalid step end.')
    const method = step.type === 'file' ? 'PUT' : 'POST'
    const body = step.type === 'file' ? data as File : JSON.stringify({ ...data })

    const urlParams = createUrlParamsFromObject(params ?? {})

    const nextStep = await fetch(`${step.url}?${urlParams}`, { method, body })
    console.log('response', nextStep)
    return processResponse(nextStep)
}

/**
 * Utils
 */
const processResponse = async (response: Response): Promise<any> => {
    if (response.ok) {
        const r = await response.json()
        console.log('response.json()', r)
        return r
    }
    else {
        let error_response
        try {
            error_response = await response.json()
        } catch (error) {
            throw new NextStepError({ message: await response.text() })
        }
        throw new NextStepError(error_response)
    }
}

class NextStepError extends Error {
    fields?: FieldError[] = undefined
    field?: string = undefined
    constructor(error: any) {
        super("NextStep error");
        console.log('error', error)
        this.name = "NextStepError";
        if (Array.isArray(error))
            this.fields = error
        else if (error.field) {
            console.log('ididiido')
            this.field = error.field
            this.message = error.message
        }
        else
            this.message = error.message
    }
}

const createUrlParamsFromObject = (paramsObj: { [key: string]: any }): string =>
    Object.keys(paramsObj).reduce((acc, current, i, arr) => {
        if (paramsObj[current] !== undefined) {
            acc += `${current}=${paramsObj[current]}`
            if (i < arr.length - 1) acc += '&'
            return acc
        }
        return acc
    }, '')

interface Filters {
    onlyCryptos?: string[],
    excludeCryptos?: string[]
}
const filterGatewaysResponse = (gatewaysResponse: GatewaysResponse, { onlyCryptos, excludeCryptos }: Filters): GatewaysResponse => {
    const _onlyCryptos = onlyCryptos?.map(code => code.toUpperCase())
    const _excludeCryptos = excludeCryptos?.map(code => code.toUpperCase())
    const filtredGateways = gatewaysResponse.gateways.map(gateway => {
        let cryptosList = gateway.cryptoCurrencies
        if (_onlyCryptos && _onlyCryptos?.length > 0)
            cryptosList = gateway.cryptoCurrencies.filter(crypto => _onlyCryptos.includes(crypto.code))
        if (_excludeCryptos && _excludeCryptos?.length > 0)
            cryptosList = cryptosList.filter(crypto => !_excludeCryptos.includes(crypto.code))
        return {
            ...gateway,
            cryptoCurrencies: cryptosList
        }
    })
    return {
        ...gatewaysResponse,
        gateways: filtredGateways
    }
}

export {
    gateways,
    rate,
    executeStep,
    NextStepError
}
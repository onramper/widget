import { NextStep } from './nextStep'

interface BaseGateway {
    identifier: string
    duration: {
        seconds: number
        message: string
    }
    available: boolean
}

interface GatewayAvailable extends BaseGateway {
    rate: number
    fees: number
    requiredKYC: (string | string[])[]
    receivedCrypto: number
    nextStep: NextStep
}

interface GatewayUnavailable extends BaseGateway {
    error: {
        type: string
        message: string
        limit?: number
    }
}

type Gateway = GatewayAvailable | GatewayUnavailable
type RateResponse = Gateway[]

export type {
    RateResponse,
    Gateway
}
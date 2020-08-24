import { GatewaysResponse } from './api/types/gateways'
import { RateResponse, GatewayRate } from './api/types/rate'
import { NextStep } from './api/types/nextStep'

export type GatewayRateOption = { id: string, name: string } & GatewayRate

export interface ItemType {
    id: string
    name: string
    info?: string
    icon?: string
    symbol?: string
    precision?: number
    currencyType?: string
}

export enum ItemCategory {
    Crypto = 'CRYPTO',
    Currency = 'CURRENCY',
    PaymentMethod = 'PAYMENT_METHOD'
}

export type StateType = {
    data: DataStateType,
    collected: CollectedStateType
    inputInterface: InputInterfaceType
    apiInterface: ApiInterfaceType
    [key: string]: any
}

export type CollectedStateType = {
    amount: number,
    amountInCrypto: boolean,
    isCalculatingAmount: boolean
    selectedCrypto?: ItemType,
    selectedCurrency?: ItemType,
    selectedPaymentMethod?: ItemType,
    selectedGateway?: GatewayRateOption,
    cryptocurrencyAddress?: string,
    defaultAddrs: {
        [key: string]: string[]
    }
    errors?: { [key: string]: ErrorObjectType }
    [key: string]: any
}

export type ErrorObjectType = {
    type: string,
    message: string
}

export type DataStateType = {
    availableCryptos: ItemType[]
    availableCurrencies: ItemType[]
    availablePaymentMethods: ItemType[]
    allRates: GatewayRateOption[]
    handleCryptoChange: (crypto?: ItemType) => | undefined | {}
    handleCurrencyChange: (currency?: ItemType) => | undefined | {}
    handlePaymentMethodChange: (paymentMehtod?: ItemType) => | undefined | {}
    //remote responses
    response_gateways?: GatewaysResponse
    filtredGatewaysByCrypto: GatewaysResponse['gateways']
    filtredGatewaysByCurrency: GatewaysResponse['gateways']
    response_rate?: RateResponse
}

export type InputInterfaceType = {
    handleInputChange: (name: string, value: any) => void
}

export type ApiInterfaceType = {
    init: (country?: string) => Promise<ErrorObjectType | undefined | {}>
    executeStep: (step: NextStep, params: { [key: string]: any }) => Promise<NextStep>
    getRates: () => Promise<ErrorObjectType | undefined | {}>
}

export const initialState: StateType = {
    collected: {
        amount: 100,
        amountInCrypto: false,
        isCalculatingAmount: true,
        selectedCrypto: undefined,
        selectedCurrency: undefined,
        selectedPaymentMethod: undefined,
        selectedGateway: undefined,
        cryptocurrencyAddress: undefined,
        defaultAddrs: {},
        errors: undefined
    },
    data: {
        availableCryptos: [],
        availableCurrencies: [],
        availablePaymentMethods: [],
        allRates: [],
        handleCryptoChange: () => undefined,
        handleCurrencyChange: () => undefined,
        handlePaymentMethodChange: () => undefined,
        response_gateways: undefined,
        filtredGatewaysByCrypto: [],
        filtredGatewaysByCurrency: [],
        response_rate: undefined
    },
    inputInterface: {
        handleInputChange: () => null
    },
    apiInterface: {
        init: async () => undefined,
        executeStep: async (nextStep: NextStep) => nextStep,
        getRates: async () => undefined
    }
}
import { ItemType, GatewayOptionType, NextStep } from '../common/types'
import { GatewaysResponse } from './api/types/gateways'
import { RateResponse } from './api/types/rate'

export type StateType = {
    data: DataStateType,
    collected: CollectedStateType
    inputInterface: InputInterfaceType
    apiInterface: ApiInterfaceType
}

export type CollectedStateType = {
    amount: number,
    amountInCrypto: boolean,
    isCalculatingAmount: boolean
    selectedCrypto?: ItemType,
    selectedCurrency?: ItemType,
    selectedPaymentMethod?: ItemType,
    selectedGateway?: GatewayOptionType,
    walletAddress?: string,
    defaultAddrs: {
        [key: string]: string[]
    }
    [key: string]: any
}

export type ErrorObjectType = { [key: string]: string } | undefined

export type DataStateType = {
    availableCryptos: ItemType[]
    availableCurrencies: ItemType[]
    availablePaymentMethods: ItemType[]
    availableRates: GatewayOptionType[]
    handleCryptoChange: (crypto?: ItemType) => ErrorObjectType
    handleCurrencyChange: (currency?: ItemType) => ErrorObjectType
    handlePaymentMethodChange: (paymentMehtod?: ItemType) => ErrorObjectType
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
    gateways: (country?: string) => Promise<ErrorObjectType>
    executeStep: (step: NextStep, params: { [key: string]: any }) => Promise<NextStep>
    getRates: () => Promise<ErrorObjectType>
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
        walletAddress: undefined,
        defaultAddrs: {}
    },
    data: {
        availableCryptos: [],
        availableCurrencies: [],
        availablePaymentMethods: [],
        availableRates: [],
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
        gateways: async () => undefined,
        executeStep: async (nextStep: NextStep) => nextStep,
        getRates: async () => undefined
    }
}
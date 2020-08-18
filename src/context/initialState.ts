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
    "files": File[],
    defaultAddrs: {
        [key: string]: string[]
    }
    [key: string]: any
}

export type DataStateType = {
    availableCryptos: ItemType[]
    availableCurrencies: ItemType[]
    availablePaymentMethods: ItemType[]
    availableRates: GatewayOptionType[]
    gateways: (country?: string) => void
    handleCryptoChange: (crypto?: ItemType) => Promise<any>
    handleCurrencyChange: (currency?: ItemType) => void
    handlePaymentMethodChange: (paymentMehtod?: ItemType) => any
    //remote responses
    response_gateways?: GatewaysResponse
    filtredGatewaysByCrypto: GatewaysResponse['gateways']
    filtredGatewaysByCurrency: GatewaysResponse['gateways']
    response_rate?: RateResponse
    filtredRatesByAviability: RateResponse
    nextStep: {
        url?: string
        data?: string[]
    }
}

export type InputInterfaceType = {
    handleInputChange: (name: string, value: any) => void
}

export type ApiInterfaceType = {
    executeStep: (step: NextStep, params: { [key: string]: any }) => Promise<any>
    getRates: () => { [key: string]: any } | undefined
}

export const initialState: StateType = {
    collected: {
        amount: 100,
        amountInCrypto: false,
        isCalculatingAmount: false,
        selectedCrypto: undefined,
        selectedCurrency: undefined,
        selectedPaymentMethod: undefined,
        selectedGateway: undefined,
        walletAddress: undefined,
        'files': [],
        "personal-fname": '',
        "personal-lname": '',
        "personal-birth": '',
        'personal-address': '',
        'personal-address2': '',
        'personal-city': '',
        'personal-postalcode': '',
        'personal-country': '',
        email: '',
        defaultAddrs: {}
    },
    data: {
        availableCryptos: [],
        availableCurrencies: [],
        availablePaymentMethods: [],
        availableRates: [],
        handleCryptoChange: async (crypto?: ItemType) => null,
        handleCurrencyChange: (currency?: ItemType) => null,
        handlePaymentMethodChange: (paymentMehtod?: ItemType) => null,
        response_gateways: undefined,
        filtredGatewaysByCrypto: [],
        filtredGatewaysByCurrency: [],
        response_rate: undefined,
        filtredRatesByAviability: [],
        gateways: (country?: string) => null,
        nextStep: {}
    },
    inputInterface: {
        handleInputChange: () => null
    },
    apiInterface: {
        executeStep: async (step: NextStep, params: { [key: string]: any }) => false,
        getRates: () => undefined
    }
}
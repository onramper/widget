import { ItemType, GatewayOptionType } from '../common/types'
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
    "personal-fname": string,
    "personal-lname": string,
    "personal-birth": string,
    'personal-address': string
    'personal-address2': string
    'personal-city': string
    'personal-postalcode': string
    'personal-country': string
    email: string
    defaultAddrs: {
        [key: string]: string[]
    }
    [key: string]: any//todo, add all inputs
}

export type DataStateType = {
    availableCryptos: ItemType[]
    availableCurrencies: ItemType[]
    availablePaymentMethods: ItemType[]
    availableRates: GatewayOptionType[]
    init: (country?: string) => void
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
    handleFilesAdded: (name: string, files: File[], maxFiles: number) => boolean,
    handleFileDeleted: (name: string, fileName: string) => void
}

export type ApiInterfaceType = {
    executeStep: (url: string, params: { [key: string]: any }) => Promise<any>
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
        init: (country?: string) => null,
        nextStep: {}
    },
    inputInterface: {
        handleInputChange: () => null,
        handleFilesAdded: () => false,
        handleFileDeleted: () => null
    },
    apiInterface: {
        executeStep: async (url: string, params: { [key: string]: any }) => false,
        getRates: () => undefined
    }
}
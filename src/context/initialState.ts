import { ListItemType } from '../common/types'
import { GatewayOptionType } from '../ChooseGatewayView/GatewayOption'

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
    selectedCrypto?: ListItemType,
    selectedCurrency?: ListItemType,
    selectedPaymentMethod?: ListItemType,
    selectedGateway?: GatewayOptionType,
    walletAddress?: string,
    "files-id": File[],
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
    availableCryptos: ListItemType[]
    availableCurrencies: ListItemType[]
    availablePaymentMethods: ListItemType[]
    availableRates: GatewayOptionType[]
    init: (country?: string) => void
    handleCryptoChange: (crypto?: ListItemType) => Promise<any>
    handleCurrencyChange: (currency?: ListItemType) => void
    handlePaymentMethodChange: (paymentMehtod?: ListItemType) => any
    //remote responses
    response_gateways: any
    filtredGatewaysByCrypto: any[]
    filtredGatewaysByCurrency: any[]
    response_rate: any[]
    filtredRatesByAviability: any[]
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
    sendCodeEmail: () => Promise<boolean>
    executeStep: (url: string, params: { [key: string]: any }) => Promise<any>
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
        'files-id': [],
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
        handleCryptoChange: async (crypto?: ListItemType) => null,
        handleCurrencyChange: (currency?: ListItemType) => null,
        handlePaymentMethodChange: (paymentMehtod?: ListItemType) => null,
        response_gateways: {},
        filtredGatewaysByCrypto: [],
        filtredGatewaysByCurrency: [],
        response_rate: [],
        filtredRatesByAviability: [],
        init: (country?: string | null) => null,
        nextStep: {}
    },
    inputInterface: {
        handleInputChange: () => null,
        handleFilesAdded: () => false,
        handleFileDeleted: () => null
    },
    apiInterface: {
        sendCodeEmail: async () => false,
        executeStep: async (url: string, params: { [key: string]: any }) => false
    }
}
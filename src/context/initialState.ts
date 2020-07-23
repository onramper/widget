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
    selectedCrypto: number,
    selectedCurrency: number,
    selectedPaymentMethod: number,
    selectedGateway: number,
    walletAddress: string,
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
    [key: string]: any//todo, add all inputs
}

export type DataStateType = {
    availableCryptos: ListItemType[]
    availableCurrencies: ListItemType[]
    availablePaymentMethods: ListItemType[]
    availableRates: GatewayOptionType[]
    init: (country?: string) => void
    handleCryptoChange: (crypto?: string) => Promise<any>
    handleCurrencyChange: (currency?: string) => void
    handlePaymentMethodChange: (paymentMehtod?: string) => any
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
    email: (url: string, email: string) => Promise<boolean>
}

export const initialState: StateType = {
    collected: {
        amount: 100,
        selectedCrypto: 0,
        selectedCurrency: 0,
        selectedPaymentMethod: 0,
        selectedGateway: 0,
        walletAddress: '',
        'files-id': [],
        "personal-fname": '',
        "personal-lname": '',
        "personal-birth": '',
        'personal-address': '',
        'personal-address2': '',
        'personal-city': '',
        'personal-postalcode': '',
        'personal-country': '',
        email: ''
    },
    data: {
        availableCryptos: [],
        availableCurrencies: [],
        availablePaymentMethods: [],
        availableRates: [],
        handleCryptoChange: async (crypto?: string) => null,
        handleCurrencyChange: (currency?: string) => null,
        handlePaymentMethodChange: (paymentMehtod?: string) => null,
        response_gateways: {},
        filtredGatewaysByCrypto: [],
        filtredGatewaysByCurrency: [],
        response_rate: [],
        filtredRatesByAviability: [],
        init: (country?: string | null) => null,
        nextStep: {
            url: undefined,
            data: undefined
        }
    },
    inputInterface: {
        handleInputChange: () => null,
        handleFilesAdded: () => false,
        handleFileDeleted: () => null
    },
    apiInterface: {
        email: async () => false
    }
}
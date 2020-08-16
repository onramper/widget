interface ItemType {
    id: string
    name: string
    info?: string
    icon?: string
    symbol?: string
    precision?: number
    currencyType?: string
}

enum ItemCategory {
    Crypto = 'CRYPTO',
    Currency = 'CURRENCY',
    PaymentMethod = 'PAYMENT_METHOD'
}

interface GatewayOptionType {
    id: string
    name: string
    duration: {
        seconds: number
        message: string
    }
    available: boolean
    rate?: number
    fees?: number
    requiredKYC?: (string | string[])[]
    receivedCrypto?: number
    nextStep?: NextStep
    error?: string
    logo?: string
}

type NextStep = {
    type: string,
    url?: string
    humanName?: string
    data?: {
        type: string
        humanName: string
        name: string
    }[]
    options?: NextStep[]
}

export type {
    ItemType,
    GatewayOptionType,
    NextStep
}

export {
    ItemCategory
}
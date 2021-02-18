interface GatewaysResponse {
    gateways: {
        identifier: string
        paymentMethods: string[]
        fiatCurrencies: Currency[]
        cryptoCurrencies: Currency[]
    }[]
    localization: {
        country: string,
        state: string | null,
        currency: string
    }
    icons?: {
        [key: string]: IconGatewaysResponse
    }
    defaultAmounts?: {
        [key: string]: number
    }
}

interface Currency {
    code: string
    precision: number
    supportsAddressTag?: boolean
}

interface IconGatewaysResponse {
    name: string
    icon: string
    symbol?: string
}

export type {
    GatewaysResponse,
    IconGatewaysResponse
}

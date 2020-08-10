interface GatewaysResponse {
    gateways: {
        paymentMethods: string[]
        fiatCurrencies: Currency[]
        cryptoCurrencies: Currency[]
    }[]
    localization: {
        country: string,
        state: string,
        currency: string
    }
    icons?: {
        [key: string]: IconGatewaysResponse
    }
}

interface Currency {
    code: string
    precision: number
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
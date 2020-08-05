interface ItemType {
    id: string
    name: string
    info?: string
    type?: string
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

export type {
    ItemType
}

export {
    ItemCategory
}
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
    acceptedContentTypes?: string[]
    hint?: string
    depositBankAccount?: {
        iban: string;
        bic: string;
        bankName: string;
        bankAddress: string;
        accountName: string;
        accountAddress: string;
    }
    reference?: string;
}

export type {
    NextStep
}
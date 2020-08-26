type NextStep = {
    type: string,
    url?: string
    humanName?: string
    data?: {
        type: string
        humanName: string
        name: string
        terms?: { humanName: string, url: string }[]
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

interface FieldError {
    field: string
    message: string
}

type NextStepErr = FieldError[] | { message: string }

export type {
    NextStep,
    NextStepErr,
    FieldError
}
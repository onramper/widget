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
    NextStep
}
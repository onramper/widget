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
}

export type {
    NextStep
}
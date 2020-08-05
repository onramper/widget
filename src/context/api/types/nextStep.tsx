interface NextStep {
    type: string
    url: string
    data: {
        type: string
        name: string
    }[]

}

export type {
    NextStep
}
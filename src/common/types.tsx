export type _ListItemType = {
    id?: string
    icon?: string,
    name: string,
    info?: string
    onClick?: (index: number) => void
    index: number
    symbol?: string
    precision?: number
    type?: string
}

export type ListItemType = Omit<_ListItemType, 'index'>
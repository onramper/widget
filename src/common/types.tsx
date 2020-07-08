export type _ListItemType = {
    icon?: string,
    name: string,
    info?: string
    onClick?: (index: number) => void
    index: number
    symbol?: string
}

export type ListItemType = Omit<_ListItemType, 'index'>
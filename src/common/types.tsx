export type _ListItemType = {
    icon: string,
    name: string,
    info?: string
    onClick?: (index: number) => void
    index: number
}

export type ListItemType = Omit<_ListItemType, 'index'>
import { ItemType } from "../../ApiContext"
import { ReactNode } from "react"

export type ListItemType = {
    rightSection?: ReactNode;
} & ItemType

export type ListItemProps = {
    index: number,
    onClick: (index: number) => void
} & ItemType & ListItemType

export type ListProps = {
    items: ListItemType[]
    onItemClick?: (index: number, item: ItemType) => void
    searchable?: boolean
}
export type ListItem = {
    id: string;
    icon?: string;
    title: string;
    info?: string;
}

export type DropdownCheckableGroupProps = {
    items: ListItem[];
    suplimentBtnText: string;
    addNewBtnText: string;
    idSelected?: string;
    onSelect: (item: ListItem) => void;
    onAdd: () => void;
}
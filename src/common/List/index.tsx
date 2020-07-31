import React, { useCallback, useState } from 'react'
import styles from './styles.module.css'
import { ListItemType, _ListItemType } from '../types'

type ListType = {
    items: ListItemType[]
    onItemClick?: (index: number, item: ListItemType) => void
    searchable?: boolean
}

const List: React.FC<ListType> = (props) => {
    const { items, searchable = false } = props
    const { onItemClick = () => null } = props

    const handleItemClick = useCallback((index: number, item: ListItemType) => {
        onItemClick(index, item)
    }, [onItemClick])

    const [query, setQuery] = useState('')

    const filterItems = useCallback((item: ListItemType) => {
        return item.name.toLowerCase().split(' ').some((substring) => substring.toLowerCase().startsWith(query))
            || item.name.toLowerCase().toLowerCase().startsWith(query)
            || item.info?.split(' ').some((substring) => substring.toLowerCase().startsWith(query))
            || item.info?.toLowerCase().startsWith(query)
            ? true : false
    }, [query])

    return (
        <div className={`${styles.list}`}>
            {searchable &&
                <input className={styles['search-box']} type='text' value={query} onChange={(e) => setQuery(e.currentTarget.value.toLowerCase())} placeholder="Search..." autoFocus />
            }
            {
                items.map((item, i) =>
                    filterItems(item) && <ListItem
                        key={i}
                        index={i}
                        name={item.name}
                        info={item.info}
                        icon={item.icon}
                        onClick={() => handleItemClick(i, item)} />
                )
            }
        </div>
    )
}

const ListItem: React.FC<_ListItemType> = (props) => {
    const { index, name, info, icon } = props
    const { onClick = () => null } = props
    return (
        <div className={`${styles['list-item']}`} onClick={() => onClick(index)}>
            {icon ? <img alt="Icon" className={`${styles['list-item__child']} ${styles['list-item__icon']}`} src={icon} /> : null}
            <div className={styles['list-item__child']}>
                <span>{name}</span>
                {info ? <span className={`${styles['list-item__info']}`}>{info}</span> : null}
            </div>
        </div>
    )
}

export default List

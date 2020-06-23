import React from 'react'
import styles from './styles.module.css'
import { ListItemType } from '../common/types'

const List: React.FC<{ items: ListItemType[] }> = (props) => {
    var { items } = props

    const listItems = items.map((item) => <ListItem key={item.name} name={item.name} info={item.info} icon={item.icon} />);

    return (
        <div className={`${styles.list}`}>
            {listItems}
        </div>
    )
}

const ListItem: React.FC<ListItemType> = (props: ListItemType) => {
    const { name, info, icon } = props
    return (
        <div className={`${styles['list-item']}`}>
            <img alt="Icon" className={`${styles['list-item__child']} ${styles['list-item__icon']}`} src={icon} />
            <div className={styles['list-item__child']}>
                <span>{name}</span>
                <span className={`${styles['list-item__info']}`}>{info}</span>
            </div>
        </div>
    )
}

export default List

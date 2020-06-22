import React from 'react'
import styles from './styles.module.css'

type ItemType = {
    icon: string,
    name: string,
    info?: string
}

const List: React.FC<{ items: ItemType[] }> = (props) => {
    var { items } = props

    const listItems = items.map((item) => <ListItem key={item.name} name={item.name} info={item.info} icon={item.icon} />);

    return (
        <div className={`${styles.list}`}>
            {listItems}
        </div>
    )
}

const ListItem: React.FC<ItemType> = (props: ItemType) => {
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

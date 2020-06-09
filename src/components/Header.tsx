import React from 'react'
import styles from '../styles.module.css'

import IconMenu from '../icons/burger_menu.svg'
import IconLeftArrow from '../icons/left_arrow.svg'

function Header(props: { title: string; backButton?: boolean }) {
    const { title, backButton = true } = props
    return (
        <nav className={styles.header}>
            {backButton ? <img className={`${styles['header__child']} ${styles['header__back-icon']}`} alt="Back" src={IconLeftArrow} /> : null}
            <h1 className={`${styles['header__child']}`}>{title}</h1>
            <img alt="menu" className={`${styles['header__child']} ${styles['header__burger-icon']}`} src={IconMenu} />
        </nav>
    )
}

export default Header
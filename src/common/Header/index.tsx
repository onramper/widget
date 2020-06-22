import React, { useContext } from 'react'
import styles from './styles.module.css'

import IconMenu from '../../icons/burger_menu.svg'
import IconLeftArrow from '../../icons/left_arrow.svg'

import { NavContext } from '../../wrappers/context'

function Header(props: { title: string; backButton?: boolean }) {
    const { title, backButton = false } = props
    const { backScreen } = useContext(NavContext)
    return (
        <nav className={styles.header}>
            {backButton ? <img onClick={() => backScreen()} className={`${styles['header__child']} ${styles['header__back-icon']}`} alt="Back" src={IconLeftArrow} /> : null}
            <h1 className={`${styles['header__child']}`}>{title}</h1>
            <img alt="menu" className={`${styles['header__child']} ${styles['header__burger-icon']}`} src={IconMenu} />
        </nav>
    )
}

export default Header
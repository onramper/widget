import React, { useContext } from 'react'
import styles from './styles.module.css'

import IconMenu from '../../icons/burger_menu.svg'
import IconLeftArrow from '../../icons/left_arrow.svg'

import { NavContext } from '../../wrappers/context'
import Menu from '../../Menu'

type HeaderType = {
    title: string;
    backButton?: boolean
    onMenuClick?: () => void
}

const Header: React.FC<HeaderType> = (props) => {
    const { nextScreen, backScreen } = useContext(NavContext)
    const { title, backButton, onMenuClick = () => nextScreen(<Menu />) } = props

    return (
        <nav className={styles.header}>
            {backButton ? <img onClick={() => backScreen()} className={`${styles['header__child']} ${styles['header__back-icon']}`} alt="Back" src={IconLeftArrow} /> : null}
            <h1 className={`${styles['header__child']}`}>{title}</h1>
            <img onClick={onMenuClick} alt="menu" className={`${styles['header__child']} ${styles['header__burger-icon']}`} src={IconMenu} />
        </nav>
    )
}

Header.defaultProps = {
    backButton: false
}

export default Header
import React, { useContext } from 'react'
import styles from './styles.module.css'

import IconMenu from '../../icons/menu.svg'
import IconLeftArrow from '../../icons/arrow-left.svg'
import IconClose from '../../icons/close.svg'

import { NavContext } from '../../NavContext'
import Menu from './Menu'

type HeaderType = {
    title: string;
    backButton?: boolean
    hideBurgerButton?: boolean
    noSeparator?: boolean
    onMenuClick?: () => void
}

const Header: React.FC<HeaderType> = (props) => {
    const { nextScreen, backScreen } = useContext(NavContext)
    const { title, backButton, hideBurgerButton, onMenuClick = () => nextScreen(<Menu />) } = props

    return (
        <nav className={`${styles.header} ${props.noSeparator ? styles['header--no-separator'] : ''}`}>
            {backButton && <img onClick={() => backScreen()} className={`${styles.header__child} ${styles['header__back-icon']}`} alt="Back" src={IconLeftArrow} />}
            <h1 className={`${styles.header__child}`}>{title}</h1>
            {!hideBurgerButton && <img onClick={onMenuClick} alt="menu" className={`${styles.header__child} ${styles['header__burger-icon']}`} src={title === 'Menu' ? IconClose : IconMenu} />}
        </nav>
    )
}

Header.defaultProps = {
    backButton: false
}

export default Header

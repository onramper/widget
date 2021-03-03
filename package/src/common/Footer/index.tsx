import React from 'react'
import styles from './styles.module.css'

import LogoOnramper from '../../icons/onramper_logo.svg'

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <span>Powered by</span>
            <img src={LogoOnramper} alt="logo"></img>
        </footer>
    )
}

export default Footer

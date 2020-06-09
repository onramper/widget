import React from 'react'
import styles from '../styles.module.css'

import LogoOnramper from '../icons/logo.svg'

function Footer() {
    return (
        <div className={styles.footer}>
            <span>Powered by</span>
            <img src={LogoOnramper}></img>
        </div>
    )
}

export default Footer
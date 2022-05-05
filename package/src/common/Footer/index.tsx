import React from 'react'
import styles from './styles.module.css'

import LogoOnramper from '../../icons/onramper_logo.svg'
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className={styles.footer}>
            <span>{t('footer.onramperPrefix')}</span>
            <img style={{opacity: 0.5, marginLeft: '0.5rem'}}src={LogoOnramper} alt="logo"></img>
        </footer>
    )
}

export default Footer

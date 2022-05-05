import React from 'react'
import stylesCommon from '../../../styles.module.css'
import help2faCc from '../../../icons/help_2fa_cc.jpg'
import { t } from 'i18next'

type Help2FACreditCardType = {

}

const Help2FACreditCard: React.FC<Help2FACreditCardType> = () => {
    const helpText = t('verifyCreditCardScreen.helpText');
    return (
        <>
            <h4 className={stylesCommon['help-title']}>{t('verifyCreditCardScreen.helpTitle')}</h4>
            <p className={stylesCommon['help-text']}>{helpText}</p>
            <img className={stylesCommon['help-img']} src={help2faCc} alt={t('verifyCreditCardScreen.pendingTransactionScreenshotAlt')} />
        </>
    )
}

export default Help2FACreditCard

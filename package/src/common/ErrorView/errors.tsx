import React from 'react'
import { ReactComponent as ErrorIllustration } from '../../icons/error.svg'
import countryNames from '../../ApiContext/utils/countryNames'
import styles from './styles.module.css'
import ButtonAction from '../ButtonAction'
import { t } from 'i18next'

export const COUNTRY_NOT_SUPPORTED = (country?: string): JSX.Element => {
    const existingCountry = countryNames[country?.toUpperCase() ?? ''];
    const _country = existingCountry ? t(`countries.${country?.toUpperCase()}`) : country?.toUpperCase();

    return (
        <>
            <ErrorIllustration className={styles['content-image']} />
            <span className={styles['content-title']}>{t('errorCountriesNotSupported.title')}</span>
            <span className={styles['content-description']}>
                {_country} {t('errorCountriesNotSupported.isNotSupportedBy')}<br />
                {t('errorCountriesNotSupported.description')}<br /><br />
                {t('errorScreens.forMoreInfo')}
            </span>
            <div className={styles['content-description']}>
                <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">{t('errorScreens.readFaqs')}</a>
            </div>
        </>
    )
}


export const DISABLED_GATEWAYS =
    <>
        <ErrorIllustration className={styles['content-image']} />
        <span className={styles['content-title']}>{t('errorDisabledGateways.title')}</span>
        <span className={styles['content-description']}>
            {t('errorDisabledGateways.description')}<br />
            {t('errorScreens.forMoreInfo')}<br /><br />
        </span>
        <div className={styles['content-description']}>
            <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">{t('errorScreens.readFaqs')}</a>
        </div>
    </>

export const API_ERROR = (message: string, cb: () => any): JSX.Element => {
    return (
        <>
            <ErrorIllustration className={styles['content-image']} />
            <span className={styles['content-title']}>{t('errorApi.title')}</span>
            <span className={styles['content-description']}>
                {message ? <span className={styles['content-message']}>{message}<br /></span> : <br />}
                {t('errorApi.description')}
            </span>
            <div className={styles['content-description']}>
                <ButtonAction className={styles['content-button']} text={t('misc.tryAgain')} size='small' onClick={cb} />
                <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">{t('errorScreens.readFaqs')}</a>
            </div>
        </>
    )
}

export const CRASH_ERROR = (cb: () => any): JSX.Element => {
    return (
        <>
            <ErrorIllustration className={styles['content-image']} />
            <span className={styles['content-title']}>{t('errorCrash.title')}</span>
            <span className={styles['content-description']}>
                {t('errorCrash.description')}
            </span>
            <div className={styles['content-description']}>
                <ButtonAction className={styles['content-button']} text={t('misc.restart')} size='small' onClick={cb} />
                <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">{t('errorScreens.readFaqs')}</a>
            </div>
        </>
    )
}

export const NO_ITEMS_FOUND = (message?: string): JSX.Element => {
    return (
        <>
            <ErrorIllustration className={styles['content-image']} />
            <span className={styles['content-title']}>{t('errorNoItemsFound.title')}</span>
            <span className={styles['content-description']}>
                {t('errorNoItemsFound.someItemsDisabled')}
                {message ? <span className={styles['content-message']}>{message}<br /></span> : <br />}
                {t('errorScreens.forMoreInfo')}
            </span>
            <div className={styles['content-description']}>
                <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">{t('errorScreens.readFaqs')}</a>
            </div>
        </>
    )
}
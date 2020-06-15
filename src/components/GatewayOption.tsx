import React, { useState } from 'react'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'
import IconBtc from '../icons/btc.svg'
import Range from '../components/Range'

const COLLAPSED_SUFFIX = "--collapsed"

function GatewayOption(props: { txTime: string, kycLevel: string, open?: boolean }) {
    const { txTime, kycLevel, open = false } = props
    const [isOpen, setIsOpen] = useState(open)
    const collapsed_suffix = (!isOpen ? COLLAPSED_SUFFIX : '')

    return (
        <div onClick={() => setIsOpen(!isOpen)} className={`${styles['option-container']} ${styles['option-container' + collapsed_suffix]}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={isOpen}></input>
            </div>
            <div className={`${styles['option-container__content']} ${styles['option-container__content' + collapsed_suffix]}`}>
                <div className={`${styles.content__info} ${styles['content__info' + collapsed_suffix]}`} >
                    <div>
                        <span>Recommended</span>
                        {isOpen ? <div className={`${styles['details']} ${styles['details' + collapsed_suffix]}`} >
                            <div className={styles.details__item}><img src={IconBtc} /><span>Tx time: {txTime}</span></div>
                            <div className={styles.details__item}><img src={IconBtc} /><span>KYC: {kycLevel}</span></div>
                        </div> : null}
                    </div>
                    {isOpen ?
                        <div className={`${styles['fees']} ${styles['fees' + collapsed_suffix]}`}>
                            <span>Total fees:</span>
                            <Range />
                        </div> : null}
                </div>
                <div className={styles.content__price} >
                    {isOpen ?
                        <div className={`${styles['gateway-logo']} ${styles['gateway-logo' + collapsed_suffix]}`}>
                            <img alt="Gateway logo" src={LogoOnramper} />
                        </div> : null}
                    <div>
                        <span className={!isOpen ? styles['receive-diff'] : ''} >{!isOpen ? '0,65%' : 'You Receive:'}</span>
                        <span>BTC 1.2564</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GatewayOption

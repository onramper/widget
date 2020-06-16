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
    console.log(!isOpen ? styles['gateway-logo--collapsed'] : '')
    return (
        <div onClick={() => setIsOpen(!isOpen)} className={`${styles['option-container']} ${!isOpen ? styles['option-container--collapsed'] : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={isOpen}></input>
            </div>
            <div className={`${styles['option-container__content']} ${!isOpen ? styles['option-container__content--collapsed'] : ''}`}>
                <div className={`${styles.content__info} ${!isOpen ? styles['content__info--collapsed'] : ''}`} >
                    <div>
                        <span>Recommended</span>
                        <div className={`${styles['details']} ${!isOpen ? styles['details--collapsed'] : ''}`} >
                            <div className={styles.details__item}><img src={IconBtc} /><span>Tx time: {txTime}</span></div>
                            <div className={styles.details__item}><img src={IconBtc} /><span>KYC: {kycLevel}</span></div>
                        </div>
                    </div>
                    <div className={`${styles['fees']} ${!isOpen ? styles['fees--collapsed'] : ''}`}>
                        <span>Total fees:</span>
                        <Range />
                    </div>
                </div>
                <div className={styles.content__price} >
                    <div className={`${styles['gateway-logo']} ${!isOpen ? styles['gateway-logo--collapsed'] : ''}`}>
                        <img alt="Gateway logo" src={LogoOnramper} />
                    </div>
                    <div>
                        <span className={`${styles['receive-diff']} ${!isOpen ? styles['receive-diff--collapsed'] : ''}`} > {!isOpen ? '0,65%' : 'You Receive:'}</span>
                        <span>BTC 1.2564</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default GatewayOption

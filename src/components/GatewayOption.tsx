import React from 'react'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'
import IconBtc from '../icons/btc.svg'
import Range from '../components/Range'

function GatewayOption(props: { txTime: string, kycLevel: string }) {
    const { txTime, kycLevel } = props
    return (
        <div className={styles['option-container']}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked></input>
            </div>
            <div className={styles['option-container__content']}>
                <div className={styles.content__info} >
                    <div>
                        <span>Recommended</span>
                        <div className={styles.details} >
                            <div className={styles.details__item}><img src={IconBtc} /><span>Tx time: {txTime}</span></div>
                            <div className={styles.details__item}><img src={IconBtc} /><span>KYC: {kycLevel}</span></div>
                        </div>
                    </div>
                    <div className={styles.fees}>
                        <span>Total fees:</span>
                        <Range />
                    </div>
                </div>
                <div className={styles.content__price} >
                    <div>
                        <img alt="Gateway logo" src={LogoOnramper} />
                    </div>
                    <div>
                        <span className={styles['receive-diff']} >0,65%</span>
                        <span>BTC 1.2564</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GatewayOption

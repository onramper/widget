import React, { useState } from 'react'
import styles from './styles.module.css'
import IconBtc from '../icons/btc.svg'
import Range from './Range'

export type GatewayOptionType = {
    name: string,
    txTime: string,
    kycLevel: string,
    amount: number,
    denom: string,
    fee: number,
    logo?: string,
    open?: boolean
}

const GatewayOption: React.FC<GatewayOptionType> = (props) => {
    const { name, txTime, kycLevel, amount, denom, fee, logo, open } = props
    const [isOpen, setIsOpen] = useState(open)

    return (
        <div onClick={() => setIsOpen(!isOpen)} className={`${styles['option-container']} ${!isOpen ? styles['option-container--collapsed'] : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={isOpen}></input>
            </div>
            <div className={`${styles['option-container__content']} ${!isOpen ? styles['option-container__content--collapsed'] : ''}`}>
                <div className={`${styles.content__info} ${!isOpen ? styles['content__info--collapsed'] : ''}`} >
                    <div>
                        <span>{name}</span>
                        <div className={`${styles['details']} ${!isOpen ? styles['details--collapsed'] : ''}`} >
                            <div className={styles.details__item}><img alt='' src={IconBtc} /><span>Tx time: {txTime}</span></div>
                            <div className={styles.details__item}><img alt='' src={IconBtc} /><span>KYC: {kycLevel}</span></div>
                        </div>
                    </div>
                    <div className={`${styles['fees']} ${!isOpen ? styles['fees--collapsed'] : ''}`}>
                        <span>Total fees:</span>
                        <Range min={1} max={6} actual={fee} /> {/* TODO: get data from context */}
                    </div>
                </div>
                <div className={styles.content__price} >
                    <div className={`${styles['gateway-logo']} ${!isOpen ? styles['gateway-logo--collapsed'] : ''}`}>
                        {logo ? <img alt="Gateway logo" src={logo} /> : null}
                    </div>
                    <div>
                        <span className={`${styles['receive-diff']} ${!isOpen ? styles['receive-diff--collapsed'] : ''}`} > {!isOpen ? '0,65%' : 'You Receive:'}</span>
                        <span>{denom} {amount}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

GatewayOption.defaultProps = {
    open: false
}

export default GatewayOption

import React from 'react'
import styles from './styles.module.css'
import IconBtc from '../icons/btc.svg'
import Range from './Range'

export type GatewayOptionType = Omit<_GatewayOptionType, 'index'>

export type _GatewayOptionType = {
    name: string,
    txTime: string,
    kycLevel: string,
    amount: number,
    denom: string,
    fee: number,
    logo?: string,
    isOpen?: boolean
    onClick?: (index: number) => void
    index: number
    selectedAmount?: number
}

const GatewayOption: React.FC<_GatewayOptionType> = (props) => {
    const { name, txTime, kycLevel, amount, denom, fee, logo, isOpen, selectedAmount = 0 } = props //todo change 

    const diffPercent = ((1 - (selectedAmount / amount)) * 100)
    const isDiffPositive = diffPercent > 0 ? true : false
    const diff2Render = Math.abs(diffPercent).toFixed(2)

    const { onClick = () => null } = props

    return (
        <div onClick={() => onClick(props.index)} className={`${styles['option-container']} ${!isOpen ? styles['option-container--collapsed'] : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={isOpen} readOnly></input>
            </div>
            <div className={`${styles['option-container__content']} ${!isOpen ? styles['option-container__content--collapsed'] : ''}`}>
                <div className={`${styles.content__info} ${!isOpen ? styles['content__info--collapsed'] : ''}`} >
                    <div>
                        <span>{name}</span>
                        {isOpen ?
                            <div className={`${styles['details']}`} >
                                <div className={styles.details__item}><img alt='' src={IconBtc} /><span>Tx time: {txTime}</span></div>
                                <div className={styles.details__item}><img alt='' src={IconBtc} /><span>KYC: {kycLevel}</span></div>
                            </div>
                            : null}
                    </div>
                    {isOpen ?
                        <div className={`${styles['fees']}`}>
                            <span>Total fees:</span>
                            <Range min={1} max={6} actual={fee} /> {/* TODO: get data from context */}
                        </div>
                        : null}
                </div>
                <div className={styles.content__price} >
                    {isOpen ?
                        <div className={`${styles['gateway-logo']}`}>
                            {logo ? <img alt="Gateway logo" src={logo} /> : null}
                        </div>
                        : null}
                    <div>
                        <span className={`${styles['receive-diff']} ${!isOpen ? `${styles['receive-diff--collapsed']} ${isDiffPositive ? styles['diff--up'] : styles['diff--down']}` : ''} `} > {!isOpen ? `${diff2Render}%` : 'You Receive:'}</span>
                        <span>{denom} {amount}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

GatewayOption.defaultProps = {

}

export default GatewayOption

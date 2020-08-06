import React, { useContext } from 'react'
import styles from './styles.module.css'
import IconDetailKYC from '../icons/kyclevelicon.svg'
import IconDetailTxTime from '../icons/txtimeicon.svg'

import { CSSTransition } from 'react-transition-group';

import { GatewayOptionType } from '../common/types'

import { APIContext } from '../context'


const transitionPropsCollapse = {
    timeout: 500,
    classNames: {
        enter: styles['collapse-enter'],
        enterActive: styles['collapse-enter-active'],
        exit: styles['collapse-exit'],
        exitActive: styles['collapse-exit-active'],
    },
    unmountOnExit: true
}

const transitionPropsPrice = {
    timeout: {
        enter: 500,
        exit: 100
    },
    classNames: {
        enter: styles['fade-enter'],
        enterActive: styles['fade-enter-active'],
        exit: styles['fade-exit'],
        exitActive: styles['fade-exit-active'],
    },
    unmountOnExit: true
}


type GateWayOptionProps = {
    index: number
    isOpen: boolean
    selectedReceivedCrypto?: number
    onClick?: (index: number) => void
} & GatewayOptionType

const GatewayOption: React.FC<GateWayOptionProps> = (props) => {
    const { collected } = useContext(APIContext)
    const { name, duration, receivedCrypto = 0, logo, isOpen, selectedReceivedCrypto = 0, available, error, requiredKYC } = props //todo change 
    const { onClick = (i) => null } = props

    const diffPercent = ((1 - (selectedReceivedCrypto / receivedCrypto)) * 100)
    const isDiffPositive = diffPercent >= 0 ? true : false
    const diff2Render = Math.abs(diffPercent).toFixed(2)

    const kycLevel = requiredKYC?.length

    var styleColorUpDownDiff = {
        "--diff-up-color": collected.amountInCrypto ? 'red' : 'green',
        "--diff-down-color": collected.amountInCrypto ? 'green' : 'red'
    } as React.CSSProperties;

    return (
        <div onClick={() => onClick(props.index)} className={`${styles['option-container']} ${!available || !isOpen ? `${styles['option-container--collapsed']} ${!available ? styles['option-container--disabled'] : ''}` : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={available && isOpen} readOnly disabled={!available}></input>
            </div>
            <div className={`${styles['option-container__content']}`}>
                <div className={`${styles.content__info}`} >
                    <span className={`${styles.title}`}>{name}</span>
                    <CSSTransition {...transitionPropsCollapse} in={isOpen && available}>
                        <div>
                            <div className={styles['collapsable-section']}>
                                <div className={`${styles['details']}`} >
                                    {duration && <div className={styles.details__item}><div><img alt='' src={IconDetailTxTime} /></div><span>Tx time: {duration.message}</span></div>}
                                    {kycLevel && <div className={styles.details__item}><div><img alt='' src={IconDetailKYC} /></div><span>KYC level: {kycLevel}</span></div>}
                                </div>
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                <div className={styles.content__price}>
                    <CSSTransition {...transitionPropsCollapse} in={isOpen && available}>
                        <div className={`${styles['gateway-logo']}`}>
                            {logo ? <img alt="Gateway logo" src={logo} /> : null}
                        </div>
                    </CSSTransition>
                    <div>
                        <CSSTransition in={!available || !isOpen} {...transitionPropsPrice}>
                            {available ?
                                <span style={styleColorUpDownDiff} className={`${styles['receive-diff']} ${`${isDiffPositive ? styles['diff--up'] : styles['diff--down']}`} `} > {`${diff2Render}%`}</span>
                                : <span>Unavailable</span>
                            }
                        </CSSTransition>
                        {/* <CSSTransition in={isOpen && available} {...transitionPropsPrice}> */}
                        {isOpen && available && <span className={`${styles['receive-diff']}`} > {collected.amountInCrypto ? 'You pay:' : 'You Receive:'}</span>}
                        {/* </CSSTransition> */}
                        {available ?
                            <span> {collected.amountInCrypto ? collected.selectedCurrency?.name : collected.selectedCrypto?.name} {receivedCrypto}</span>
                            : <span>{!error ? 'Try again later' : error}</span>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

GatewayOption.defaultProps = {

}

export default GatewayOption

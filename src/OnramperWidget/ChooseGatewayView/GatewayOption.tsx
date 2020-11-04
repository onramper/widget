import React, { useContext } from 'react'
import styles from './styles.module.css'
/* import IconDetailKYC from '../icons/kyc_level.svg'
import IconDetailTxTime from '../icons/tx_time.svg' */
import IconFastTime from '../icons/fast-time.svg'
import IconKYCReq from '../icons/card.svg'

import { CSSTransition } from 'react-transition-group';

import { GatewayRateOption } from '../ApiContext'

import { APIContext } from '../ApiContext'


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
} & GatewayRateOption

const GatewayOption: React.FC<GateWayOptionProps> = (props) => {
    const { collected } = useContext(APIContext)

    const { name, duration, receivedCrypto = 0, isOpen, selectedReceivedCrypto = 0, available, error, requiredKYC } = props //todo change 
    const { onClick = (i) => null } = props

    let diffPercent: number;
    let isDiffPositive: boolean;
    if (receivedCrypto > selectedReceivedCrypto) {
        diffPercent = (((receivedCrypto / selectedReceivedCrypto) - 1) * 100)
        isDiffPositive = true;
    } else {
        diffPercent = ((1 - (receivedCrypto / selectedReceivedCrypto)) * 100)
        isDiffPositive = false;
    }
    const diff2Render = diffPercent.toFixed(2)

    const kycLevel = requiredKYC?.length

    var styleColorUpDownDiff = {
        "--diff-up-color": collected.amountInCrypto ? '#E85858' : '#008000',
        "--diff-down-color": collected.amountInCrypto ? '#008000' : '#E85858'
    } as React.CSSProperties;

    return (
        <div onClick={() => onClick(props.index)} className={`${styles['option-container']} ${!available || !isOpen ? `${styles['option-container--collapsed']} ${!available ? styles['option-container--disabled'] : ''}` : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={available && isOpen} readOnly disabled={!available}></input>
            </div>
            <div className={`${styles['option-container__content']}`}>
                <div className={`${styles.content__info}`} >
                    <div className={styles['title-container']} >
                        <div className={`${styles['title-item']} ${styles['logo-container']}`}>
                            <img alt='' src={props.icon} />
                        </div>
                        <div className={`${styles['title-item']} ${styles.title}`}>{name}</div>
                    </div>
                    <CSSTransition {...transitionPropsCollapse} in={isOpen && available}>
                        <div className={styles['collapsable-section']}>
                            <div className={`${styles['details']}`} >
                                {duration && <div style={{ height: '0.4375rem' }} className={styles.details__item}><div></div><span></span></div>} {/* Used as margin-top */}
                                {duration && <div className={styles.details__item}><div><img alt='' src={IconFastTime} /></div><span>{duration.message}</span></div>}
                                {kycLevel && <div className={styles.details__item}><div><img alt='' src={IconKYCReq} /></div><span>No ID required</span></div>}
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                <div className={styles.content__price}>
                    <CSSTransition {...transitionPropsCollapse} in={isOpen && available}>
                        <div>
                            <div className={`${styles['gateway-badge']}`}>
                                {/* {icon && <img alt="Gateway logo" src={icon} />} */}
                                <span>Best offer</span>
                            </div>
                        </div>
                    </CSSTransition>
                    <div>
                        <CSSTransition in={!available || !isOpen} {...transitionPropsPrice}>
                            {available ?
                                <span style={styleColorUpDownDiff} className={`${styles['receive-diff']} ${styles['receive-diff--diff']} ${`${isDiffPositive ? styles['diff--up'] : styles['diff--down']}`} `} > {`${diff2Render}%`}</span>
                                : <span>Unavailable</span>
                            }
                        </CSSTransition>
                        {/* <CSSTransition in={isOpen && available} {...transitionPropsPrice}> */}
                        {isOpen && available && <span className={`${styles['receive-diff']}`} > {collected.amountInCrypto ? 'You pay:' : 'You receive:'}</span>}
                        {/* </CSSTransition> */}
                        {available ?
                            <span> {collected.amountInCrypto ? collected.selectedCurrency?.name : collected.selectedCrypto?.name} {receivedCrypto}</span>
                            : <span>{!error?.message ? 'Try again later' : error?.message}</span>
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

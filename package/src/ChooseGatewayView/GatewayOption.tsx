import React, { useContext, useEffect, useState } from 'react'
import styles from './styles.module.css'
/* import IconDetailKYC from '../icons/kyc_level.svg'
import IconDetailTxTime from '../icons/tx_time.svg' */
import IconFastTime from '../icons/fast-time.svg'
import IconKYCReq from '../icons/card.svg'

import { CSSTransition } from 'react-transition-group';

import { APIContext, GatewayRateOption } from '../ApiContext'

const transitionPropsCollapse = {
    timeout: 500,
    classNames: {
        enter: styles['collapse-enter'],
        enterActive: styles['collapse-enter-active'],
        exit: styles['collapse-exit'],
        exitActive: styles['collapse-exit-active']
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
        exitActive: styles['fade-exit-active']
    },
    unmountOnExit: true
}


type GateWayOptionProps = {
    index: number
    isOpen: boolean
    selectedReceivedCrypto?: number
    badges?: badgeType
    onClick?: (index: number, id: number) => void
} & GatewayRateOption

const GatewayOption: React.FC<GateWayOptionProps> = (props) => {
    const { collected } = useContext(APIContext)
    /* const [transitionRefs] = useState(Array(3).map(() => React.useRef(null))) */
    const transitionRefs1 = React.useRef(null)
    const transitionRefs2 = React.useRef(null)
    const transitionRefs3 = React.useRef(null)
    const [badge, setBadge] = useState("Alternative")

    const { name, duration, receivedCrypto = 0, isOpen, selectedReceivedCrypto = 0, available, error, badges = {} } = props //todo change 
    const { onClick } = props

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

    const styleColorUpDownDiff = {
        "--diff-up-color": collected.amountInCrypto ? '#E85858' : '#008000',
        "--diff-down-color": collected.amountInCrypto ? '#008000' : '#E85858'
    } as React.CSSProperties;

    useEffect(() => {
        if (props.index === 0 && isOpen) {
            onClick?.(props.index, props.badges?.[name]._id ?? 0)
        }
    }, [onClick, props.index, props.badges, name, isOpen])

    useEffect(() => {
        if (props.index === 0 && badges[name]?.count > 1) {
            setBadge('Best option')
        }
        else if (badges[name]?.bestOffer) {
            setBadge('Best offer')
        }
        else if (badges[name]?.easiest) {
            setBadge('Easiest')
        }
        else if (badges[name]?.fastest) {
            setBadge('Fastest')
        }
        else if (badges[name]?.fast) {
            setBadge('Fast')
        }
    }, [badges, name, props.index])

    return (
        <div onClick={() => onClick?.(props.index, props.badges?.[name]._id ?? 0)} className={`${styles['option-container']} ${!available || !isOpen ? `${styles['option-container--collapsed']} ${!available ? styles['option-container--disabled'] : ''}` : ''}`}>
            <div className={styles['option-container__radio']}>
                <input type='radio' checked={available && isOpen} readOnly disabled={!available}></input>
            </div>
            <div className={`${styles['option-container__content']}`}>
                <div className={`${styles.content__info}`} >
                    <div className={styles['title-container']} >
                        <div className={`${styles['logo-container']}`}>
                            <img alt='' src={props.icon} />
                        </div>
                        <div className={`${styles.title}`}>{name}</div>
                    </div>
                    <CSSTransition nodeRef={transitionRefs1} {...transitionPropsCollapse} in={isOpen && available}>
                        <div ref={transitionRefs1} className={styles['collapsable-section']}>
                            <div className={`${styles.details}`} >
                                {duration && <div style={{ height: '0.4375rem' }} className={styles.details__item}><div></div><span></span></div>} {/* Used as margin-top */}
                                {duration && <div className={styles.details__item}><div><img alt='' src={IconFastTime} /></div><span>{duration.message}</span></div>}
                                {<div className={styles.details__item}><div><img alt='' src={IconKYCReq} /></div><span>{props.badges?.[props.name].noId ? "No ID required" : "Identification required"}</span></div>}
                            </div>
                        </div>
                    </CSSTransition>
                </div>
                <div className={styles.content__price}>
                    <CSSTransition nodeRef={transitionRefs2} {...transitionPropsCollapse} in={isOpen && available}>
                        <div ref={transitionRefs2} >
                            <div className={`${styles['gateway-badge']}`}>
                                {/* {icon && <img alt="Gateway logo" src={icon} />} */}
                                <span>{badge}</span>
                            </div>
                        </div>
                    </CSSTransition>
                    <div>
                        <CSSTransition nodeRef={transitionRefs3} in={!available || !isOpen} {...transitionPropsPrice}>
                            {available ?
                                <span ref={transitionRefs3} style={styleColorUpDownDiff} className={`${styles['receive-diff']} ${styles['receive-diff--diff']} ${`${isDiffPositive ? styles['diff--up'] : styles['diff--down']}`} `} > {`${diff2Render}%`}</span>
                                : <span ref={transitionRefs3} >Unavailable</span>
                            }
                        </CSSTransition>
                        {/* <CSSTransition in={isOpen && available} {...transitionPropsPrice}> */}
                        {isOpen && available && <span className={`${styles['receive-diff']}`} > {collected.amountInCrypto ? 'You pay:' : 'You receive:'}</span>}
                        {/* </CSSTransition> */}
                        {available ?
                            <span className={styles['receive-amount']}> {collected.amountInCrypto ? collected.selectedCurrency?.name : collected.selectedCrypto?.name} {receivedCrypto}</span>
                            : <span>{!error?.message ? 'Try again later' : error?.message}</span>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export interface badgeType {
    [key: string]: {
        _id: number
        fast: boolean
        noId: boolean
        fastest: boolean
        easiest: boolean
        bestOffer: boolean
        count: number
    }
}

export default GatewayOption

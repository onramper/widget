import React, { useState } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import IconChevron from '../../icons/chevron_right.svg'
import { ReactComponent as IconPay } from '../../icons/payicon.svg'
/* import { ReactComponent as IconFees } from '../../icons/feesicon.svg' */
import { ReactComponent as IconWallet } from '../../icons/walleticon.svg'
import { ReactComponent as IconExpectedtime } from '../../icons/expectedtimeicon.svg'

import { CSSTransition } from 'react-transition-group';

type BodyConfirmPaymentViewType = {
    onButtonAction: () => void
    payAmount: number
    fees: number
    currency: string

    cryptoAmount: number
    cryptoDenom: string
    cryptoAddr: string
    cryptoIcon: string
    txTime: string


    conversionRate: number
    gatewayFee: string
    onramperFee: string
}

const BodyConfirmPaymentView: React.FC<BodyConfirmPaymentViewType> = (props) => {

    const [isExpanded, setIsExpanded] = useState(false)

    const { onButtonAction } = props

    return (
        <main className={stylesCommon.body}>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow} ${styles['container']}`}>
                <ul className={`${styles['wrapper']}`}>
                    <Item type='main' icon={<IconPay className={styles['icon']} />} title='Pay' content={`${props.payAmount} ${props.currency}`} onClick={() => setIsExpanded(actual => !actual)} isExpanded={isExpanded} />
                    <CSSTransition
                        in={isExpanded}
                        timeout={1000}
                        classNames={{
                            enter: styles['details-enter'],
                            enterActive: styles['details-enter-active'],
                            exit: styles['details-exit'],
                            exitActive: styles['details-exit-active'],
                        }}
                        unmountOnExit
                        onEnter={() => setIsExpanded(true)}
                        onExited={() => setIsExpanded(false)}
                    >
                        <div className={styles['details-container']}>
                            <Item type='detail' title='Conversion rate' content={`1 ${props.cryptoDenom} = ${props.conversionRate} ${props.currency}`} />
                            <Item type='detail' title='Transaction fee' content={props.gatewayFee} />
                        </div>
                    </CSSTransition>
                    <Item type='main' icon={props.cryptoIcon} title='In exchange of' content={`${props.cryptoAmount} ${props.cryptoDenom}`} />
                </ul>
                <ul className={`${styles['wrapper']}`}>
                    <Item type='main' icon={<IconWallet className={styles['icon']} />} title={`${props.cryptoDenom} wallet address`} content={props.cryptoAddr} single />
                </ul>
                <ul className={`${styles['wrapper']}`}>
                    <Item type='main' icon={<IconExpectedtime className={styles['icon']} />} title='Expected transaction time' content={props.txTime} single />
                </ul>
                <label className={styles['terms']}><input type="checkbox" name='agreement-wyre' /> I accept the gateway's privacy policy, transaction policy and terms of use and Onramper's privacy policy and terms of use.</label>
            </div>
            <div className={`${stylesCommon['body__child']}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Confirm</button>
            </div>
        </main >
    )
}

type ItemType = {
    type: 'main' | 'detail'
    single?: boolean,
    onClick?: () => void,
    title: string,
    content: string
    icon?: React.ReactNode | string
    isExpanded?: boolean
}

const Item: React.FC<ItemType> = (props) => {
    const { isExpanded = false, single = false, onClick = () => null, icon = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' } = props
    const typeClass = props.type === 'main' ? 'item--main' : 'item--detail'

    return (
        <li className={`${styles['item']} ${styles[typeClass]} ${single ? styles['item--single'] : ''}`}>
            {props.type === 'main' ?
                /* <img className={`${styles['icon']}`} src={icon} alt='Icon item' /> */
                /* <svg className={`${styles['icon']}`}>
                    <use xlinkHref={`${icon}#icon`} />
                </svg> */
                typeof icon === 'string' ? <img className={`${styles['icon']}`} src={icon} alt='Icon item' /> : icon
                :
                <i className={styles['dot']} />
            }
            <div className={`${styles['content']} ${props.onClick ? styles['content--expandable'] : ''}`} onClick={onClick}>
                <span className={styles['title']} >{props.title}</span>
                <span className={styles['description']} >{props.content}</span>
            </div>
            {props.onClick ? <img src={IconChevron} className={`${styles['chevron']} ${isExpanded ? styles['chevron--down'] : styles['chevron--up']}`} alt='Expand button' onClick={onClick} /> : null}
        </li>
    )
}

BodyConfirmPaymentView.defaultProps = {

}

export default BodyConfirmPaymentView
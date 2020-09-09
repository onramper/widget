import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import { NavContext } from '../../NavContext'
import BuyCryptoView from '../../BuyCryptoView'

import { ReactComponent as TICK_GREEN } from '../../icons/success_green.svg'
import { ReactComponent as TICK_BLUE } from '../../icons/success_blue.svg'

type BodySuccessViewType = {
    txType: "instant" | "pending"
}

const BodySuccessView: React.FC<BodySuccessViewType> = (props) => {

    const { onlyScreen } = useContext(NavContext)

    return (
        <main className={`${stylesCommon.body}`}>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow} ${styles.body}`}>
                {props.txType === 'instant' ? <TICK_GREEN className={styles['success-icon']} /> : <TICK_BLUE className={styles['success-icon']} />}
                <span className={styles['title']}>{props.txType === 'instant' ? 'Your transaction is being processed' : 'Your transaction is waiting for payment'}</span>
                <span className={styles['info']}>{props.txType === 'instant' ? 'You will receive your cryptos soon' : 'Complete the payment to get your cryptos. We sent you the instructions and the payment info to your email.'}</span>
                {props.txType === 'pending' && false && <span className={styles['button--link']}>Download your payment info</span>}
                <button onClick={() => onlyScreen(<BuyCryptoView />)} className={`${styles['button--basic']} ${props.txType === 'pending' ? styles['button--pending'] : ''}`} >Buy more crypto</button>
            </div>
        </main>
    )
}

BodySuccessView.defaultProps = {

}

export default BodySuccessView
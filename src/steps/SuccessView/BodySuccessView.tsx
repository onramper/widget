import React from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import TICK_GREEN from '../../icons/txsuccessful.jpg'
import TICK_BLUE from '../../icons/txsuccessful_blue.png'

type BodySuccessViewType = {
    txType: "instant" | "pending"
}

const BodySuccessView: React.FC<BodySuccessViewType> = (props) => {
    return (
        <main className={`${stylesCommon.body}`}>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow} ${styles.body}`}>
                <img alt="Success icon" src={props.txType === 'instant' ? TICK_GREEN : TICK_BLUE} />

                <span className={styles['title']}>{props.txType === 'instant' ? 'Your transaction is being processed' : 'Your transaction has been requested'}</span>

                <span className={styles['info']}>{props.txType === 'instant' ? 'You will receive your cryptos soon' : 'Complete the payment to get your cryptos. We sent you instructions to your email.'}</span>

                {props.txType === 'pending' && false && <span className={styles['button--link']}>Download payment info</span>}
            </div>
        </main>
    )
}

BodySuccessView.defaultProps = {

}

export default BodySuccessView
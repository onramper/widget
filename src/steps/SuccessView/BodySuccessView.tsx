import React from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import IconBTC from '../../icons/txsuccessful.jpg'

type BodySuccessViewType = {
}

const BodySuccessView: React.FC<BodySuccessViewType> = () => {
    return (
        <main className={`${stylesCommon.body} ${styles.body}`}>
            <img alt="Success icon" src={IconBTC} />
            <span className={styles['title']}>Your transaction is being processed</span>
            <span className={styles['info']}>You will receive your cryptos soon</span>
        </main>
    )
}

BodySuccessView.defaultProps = {

}

export default BodySuccessView
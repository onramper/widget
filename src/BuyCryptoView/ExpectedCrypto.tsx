import React from 'react'
import styles from './styles.module.css'

type ExpectedCryptoType = {
    amount: number,
    denom: string,
    className?: string
}

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
    const { amount, denom, className } = props
    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            <span className={styles['expected-crypto__amount']}>{`${Math.round(amount * 1e8) / 1e8} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>Crypto you get (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
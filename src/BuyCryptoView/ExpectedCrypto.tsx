import React from 'react'
import styles from './styles.module.css'

function ExpectedCrypto(props: { amount: number, denom: string, className?: string }) {
    const { amount, denom, className } = props
    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            <span className={styles['expected-crypto__amount']}>{`${amount} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>Crypto you get (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
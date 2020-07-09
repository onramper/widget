import React, { useContext, useEffect, useState, useCallback } from 'react'
import styles from './styles.module.css'

import { APIContext } from '../wrappers/APIContext'

type ExpectedCryptoType = {
    amount: number,
    denom: string,
    className?: string
}

const calculateAmount = (amount: number, rate: number, fee: number) => {
    console.log(amount,
        rate,
        fee)
    let amount2Get = amount * rate
    return amount2Get - amount2Get * fee / 100
}

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
    const { amount, denom, className } = props

    const { data } = useContext(APIContext);
    const { availableGateways } = data
    const [lowestFeeGateway, setLowestFeeGateway] = useState({ rate: 0, fee: 0 })

    const setMinFee = useCallback(() => {
        let lowest = Number.POSITIVE_INFINITY;
        let index = 0
        let tmp;

        for (let i = availableGateways.length - 1; i >= 0; i--) {
            tmp = availableGateways[i].fee;
            if (tmp < lowest) {
                lowest = tmp;
                index = i;
            }
        }
        if (availableGateways.length > 0) setLowestFeeGateway(availableGateways[index])
    }, [availableGateways])

    useEffect(() => {
        setMinFee()
    }, [setMinFee])

    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            {console.log(lowestFeeGateway)}
            <span className={styles['expected-crypto__amount']}>{`${Math.round(calculateAmount(amount, lowestFeeGateway.rate, lowestFeeGateway.fee) * 1e8) / 1e8} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>Crypto you get (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
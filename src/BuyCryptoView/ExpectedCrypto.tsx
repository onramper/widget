import React, { useContext, useEffect, useState, useCallback } from 'react'
import styles from './styles.module.css'

import { APIContext } from '../wrappers/APIContext'

type ExpectedCryptoType = {
    denom: string,
    className?: string
}

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
    const { denom, className } = props
    const [expectedCrypto, setExpectedCrypto] = useState(0)

    const { data, remote, collected } = useContext(APIContext);
    const { availableRates = [] } = data
    const [moreExpectedCrypto, setMoreExpectedCrypto] = useState({ rate: 0, fee: 0 })

    useEffect(() => {
        async function calculateExpectedCrypto() {
            setExpectedCrypto(remote.calculateExpectedCrypto(collected.amount, moreExpectedCrypto.rate, moreExpectedCrypto.fee))
        }
        calculateExpectedCrypto()
    }, [collected.amount, remote, moreExpectedCrypto])

    const setMinFee = useCallback(() => {
        let lowest = Number.POSITIVE_INFINITY;
        let index = 0
        let tmp;

        for (let i = availableRates.length - 1; i >= 0; i--) {
            tmp = availableRates[i].amountCrypto;
            if (tmp > lowest) {
                lowest = tmp;
                index = i;
            }
        }
        if (availableRates.length > 0) setMoreExpectedCrypto({ rate: availableRates[index].rate, fee: availableRates[index].fees })
    }, [availableRates])

    useEffect(() => {
        setMinFee()
    }, [setMinFee])

    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            <span className={styles['expected-crypto__amount']}>{`${expectedCrypto} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>Crypto you get (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
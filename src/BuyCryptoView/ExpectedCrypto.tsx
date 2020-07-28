import React, { useContext, useEffect, useState, useCallback } from 'react'
import styles from './styles.module.css'

import { APIContext } from '../context'

type ExpectedCryptoType = {
    denom: string,
    className?: string
    isLoading: boolean
    amountInCrypto?: boolean
}

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
    const { denom, className, isLoading, amountInCrypto = false } = props

    const [expectedCrypto, setExpectedCrypto] = useState(0)

    const { data } = useContext(APIContext);
    const { availableRates } = data

    const setMaxExpectedCrypto = useCallback(() => {
        let lowest = Number.POSITIVE_INFINITY;
        let index = 0
        let tmp;

        for (let i = availableRates.length - 1; i >= 0; i--) {
            tmp = availableRates[i].receivedCrypto;
            if (tmp > lowest) {
                lowest = tmp;
                index = i;
            }
        }

        availableRates.length > 0 ? setExpectedCrypto(availableRates[index].receivedCrypto) : setExpectedCrypto(0)
    }, [availableRates])

    useEffect(() => {
        setMaxExpectedCrypto()
    }, [setMaxExpectedCrypto])

    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            <span className={styles['expected-crypto__amount']}>{isLoading ? 'Calculating price...' : `${expectedCrypto} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>{amountInCrypto ? 'Amount you pay' : 'Crypto you get'} (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
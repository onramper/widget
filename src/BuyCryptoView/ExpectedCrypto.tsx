import React, { useContext, useEffect, useState, useCallback } from 'react'
import styles from './styles.module.css'

import { APIContext } from '../context'
import { GatewayOptionType } from '../common/types'

type ExpectedCryptoType = {
    denom: string,
    className?: string
    isLoading: boolean
    amountInCrypto?: boolean
}

const ExpectedCrypto: React.FC<ExpectedCryptoType> = (props) => {
    const { denom, className, isLoading, amountInCrypto = false } = props

    const [expectedCrypto, setExpectedCrypto] = useState(0)

    const { data, inputInterface } = useContext(APIContext);
    const { availableRates } = data
    const { handleInputChange } = inputInterface

    const setMaxExpectedCrypto = useCallback(() => {
        let lowest = Number.POSITIVE_INFINITY;
        let index = 0
        let tmp: number;
        let pricedRates = availableRates.filter((item: GatewayOptionType) => item.available)

        for (let i = pricedRates.length - 1; i >= 0; i--) {
            tmp = pricedRates[i].receivedCrypto ?? 0;
            if (tmp > lowest) {
                lowest = tmp;
                index = i;
            }
        }

        setExpectedCrypto(pricedRates[index]?.receivedCrypto ?? 0)
    }, [availableRates])

    useEffect(() => {
        setMaxExpectedCrypto()
    }, [setMaxExpectedCrypto])

    useEffect(() => {
        handleInputChange('bestExpectedCrypto', expectedCrypto)
    }, [expectedCrypto, handleInputChange])

    return (
        <div className={`${styles['expected-crypto']} ${className}`}>
            <span className={styles['expected-crypto__amount']}>{isLoading ? 'Fetching best price...' : `${expectedCrypto} ${denom}`}</span>
            <span className={styles['expected-crypto__info']}>{amountInCrypto ? 'Amount you pay' : 'Crypto you get'} (estimation)</span>
        </div>
    )
}

export default ExpectedCrypto
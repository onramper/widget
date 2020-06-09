import React from 'react'
import styles from '../styles.module.css'

import InputButton from './InputButton'
import InputText from './InputText'
import ExpectedCrypto from './ExpectedCrypto'

import IconBTC from '../icons/btc.svg'
import IconCC from '../icons/ccs.svg'
import IconUSD from '../icons/usd.svg'

function SelectCrypto() {
    return (
        <div className={styles.body}>
            <InputButton iconPosition='end' className={styles['body__child']} label="I want to buy" selectedOption="Bitcoin" icon={IconBTC} />
            <div className={`${styles['body__child']} ${styles['row-fields']}`}>
                <InputText iconPosition='end' className={styles['row-fields__child']} label="Amount" symbol="$" placeholder="100" icon={IconBTC} />
                <InputButton iconPosition='end' className={styles['row-fields__child']} label="Currency" selectedOption="USD" icon={IconBTC} />
            </div>
            <InputButton iconPosition="end" className={styles['body__child']} label="Payment method" selectedOption="Credit card" icon={IconCC} />
            <ExpectedCrypto className={`${styles['body__child']} ${styles.grow}`} amount={0.02} denom="BTC" />
            <button className={`${styles['body__child']} ${styles['button-action']}`}>Get crypto</button>
        </div>
    )
}

export default SelectCrypto
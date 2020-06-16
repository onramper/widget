import React from 'react'
import styles from './styles.module.css'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputText from '../common/Input/InputText'
import ExpectedCrypto from './ExpectedCrypto'

import IconBTC from '../icons/btc.svg'
import IconCC from '../icons/ccs.svg'
import IconUSD from '../icons/usd.svg'

function BodyBuyCrypto() {
    return (
        <div className={stylesCommon.body}>
            <InputButton className={stylesCommon['body__child']} label="I want to buy" selectedOption="Bitcoin" icon={IconBTC} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText className={stylesCommon['row-fields__child']} label="Amount" symbol="$" placeholder="100" />
                <InputButton className={stylesCommon['row-fields__child']} label="Currency" selectedOption="USD" icon={IconUSD} />
            </div>
            <InputButton iconPosition="end" className={stylesCommon['body__child']} label="Payment method" selectedOption="Credit card" icon={IconCC} />
            <ExpectedCrypto className={`${stylesCommon['body__child']} ${stylesCommon.grow}`} amount={0.02} denom="BTC" />
            <button className={`${stylesCommon['body__child']} ${styles['button-action']}`}>Get crypto</button>
        </div>
    )
}

export default BodyBuyCrypto
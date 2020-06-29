import React from 'react'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputText from '../common/Input/InputText'
import ExpectedCrypto from './ExpectedCrypto'

import { ListItemType } from '../common/types'

type BodyBuyCryptoType = {
    onBuyCrypto: () => void,
    openPickCrypto: () => void,
    openPickCurrency: () => void,
    openPickPayment: () => void,
    selectedCrypto: ListItemType,
    selectedCurrency: ListItemType,
    selectedPaymentMethod: ListItemType,
    expectedAmount: number,
    amountValue: number
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const BodyBuyCrypto: React.FC<BodyBuyCryptoType> = (props) => {
    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment } = props
    const { selectedCrypto, selectedCurrency, selectedPaymentMethod, expectedAmount, amountValue } = props
    const { handleInputChange } = props
    return (
        <main className={stylesCommon.body}>
            <InputButton onClick={openPickCrypto} className={stylesCommon['body__child']} label="I want to buy" selectedOption={selectedCrypto.name} icon={selectedCrypto.icon} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText name='amount' type='number' value={amountValue} onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="Amount" symbol="$" placeholder="100" />
                <InputButton onClick={openPickCurrency} className={stylesCommon['row-fields__child']} label="Currency" selectedOption={selectedCurrency.name} icon={selectedCurrency.icon} />
            </div>
            <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon['body__child']} label="Payment method" selectedOption={selectedPaymentMethod.name} icon={selectedPaymentMethod.icon} />
            <ExpectedCrypto className={`${stylesCommon['body__child']} ${stylesCommon.grow}`} amount={expectedAmount} denom="BTC" />
            <div className={`${stylesCommon['body__child']}`}>
                <button onClick={onBuyCrypto} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyBuyCrypto.defaultProps = {
    selectedCrypto: {
        name: 'Loading...',
        icon: ''
    },
    selectedCurrency: {
        name: 'Loading...',
        icon: ''
    },
    selectedPaymentMethod: {
        name: 'Loading...',
        icon: ''
    },
}

export default BodyBuyCrypto
import React from 'react'
import styles from './styles.module.css'
import stylesCommon from '../../styles.module.css'

import InputButton from '../../common/Input/InputButton'
import InputText from '../../common/Input/InputText'

import { ListItemType } from '../../common/types'

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
            <InputText name='card-number' onChange={handleInputChange} className={stylesCommon['body__child']} label="Card number" placeholder="" />
            <InputText name='card-name' onChange={handleInputChange} className={stylesCommon['body__child']} label="Card holder name" placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText name='card-date' onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="Expiry date" placeholder="MM-YY" />
                <InputText name='card-ccv' onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="CCV" placeholder="123" />
            </div>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button className={`${stylesCommon['button-action']}`}>Continue</button>
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
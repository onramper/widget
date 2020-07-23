import React, { useContext } from 'react'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputText from '../common/Input/InputText'
import ButtonAction from '../common/ButtonAction'
import ExpectedCrypto from './ExpectedCrypto'

import { APIContext } from '../context'

import { ListItemType } from '../common/types'

type BodyBuyCryptoType = {
    onBuyCrypto: () => void,
    openPickCrypto: () => void,
    openPickCurrency: () => void,
    openPickPayment: () => void,
    selectedCrypto: ListItemType,
    selectedCurrency: ListItemType,
    selectedPaymentMethod: ListItemType
    handleInputChange: (name: string, value: any) => void
}

const BodyBuyCrypto: React.FC<BodyBuyCryptoType> = (props) => {
    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment } = props
    const { selectedCrypto, selectedCurrency, selectedPaymentMethod } = props
    const { handleInputChange } = props
    const { collected } = useContext(APIContext);

    return (
        <main className={stylesCommon.body}>
            <InputButton onClick={openPickCrypto} className={stylesCommon['body__child']} label="I want to buy" selectedOption={selectedCrypto.name} icon={selectedCrypto.icon} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText name='amount' type='number' value={collected.amount} onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="Amount" symbol={selectedCurrency.symbol} placeholder="100" />
                <InputButton onClick={openPickCurrency} className={stylesCommon['row-fields__child']} label="Currency" selectedOption={selectedCurrency.name} icon={selectedCurrency.icon} />
            </div>
            <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon['body__child']} label="Payment method" selectedOption={selectedPaymentMethod.name} icon={selectedPaymentMethod.icon} />
            <ExpectedCrypto className={`${stylesCommon['body__child']} ${stylesCommon.grow}`} denom={selectedCrypto.name} isLoading={selectedCrypto.name === LOAGIND_TEXT} />
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={onBuyCrypto} text='Get crypto' />
            </div>
        </main >
    )
}

const LOAGIND_TEXT = 'Loading...'

BodyBuyCrypto.defaultProps = {
    selectedCrypto: {
        name: LOAGIND_TEXT,
        icon: ''
    },
    selectedCurrency: {
        name: LOAGIND_TEXT,
        icon: ''
    },
    selectedPaymentMethod: {
        name: LOAGIND_TEXT,
        icon: ''
    },
}

export default BodyBuyCrypto
import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputTextAmount from '../common/Input/InputTextAmount'
import ButtonAction from '../common/ButtonAction'
import ExpectedCrypto from './ExpectedCrypto'

import { APIContext } from '../ApiContext'

import { ItemType, ItemCategory } from '../ApiContext'
import InfoBox from '../common/InfoBox'
import ErrorVisual from '../common/ErrorVisual'

interface BodyBuyCryptoProps {
    onBuyCrypto: () => void
    openPickCrypto?: () => void
    openPickCurrency?: () => void
    openPickPayment?: () => void
    onPriceError?: (errName: string) => void
    selectedCrypto?: ItemType
    selectedCurrency?: ItemType
    selectedPaymentMethod?: ItemType
    handleInputChange: (name: string, value: any) => void
    errors?: { [key: string]: any }
    isFilled?: boolean
}



const BodyBuyCrypto: React.FC<BodyBuyCryptoProps> = (props) => {
    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment, onPriceError = (s: string) => null } = props
    const { selectedCrypto = LoadingItem, selectedCurrency = LoadingItem, selectedPaymentMethod = LoadingItem, errors = {}, isFilled = true } = props
    const { handleInputChange } = props
    const { collected } = useContext(APIContext);

    const [pairs, setPairs] = useState<ItemType[]>()
    const [amountInCrypto, setAmountInCrypto] = useState(false)
    const [symbolRecentlyChanged, setSymbolRecentlyChanged] = useState(false)

    const generalErrors = Object.keys(errors).filter(error => errors[error].type !== 'PARAM')

    useEffect(() => {
        setPairs([selectedCurrency, selectedCrypto])
    }, [selectedCurrency, selectedCrypto])

    const handleSymbolChange = useCallback(
        (item: ItemType | undefined) => {
            if (item) {
                if (symbolRecentlyChanged) {
                    if (collected.bestExpectedCrypto !== 0)
                        handleInputChange('amount', collected.bestExpectedCrypto)
                    setSymbolRecentlyChanged(false)
                }
                handleInputChange('amountInCrypto', item.currencyType === ItemCategory.Crypto)
                setAmountInCrypto(item.currencyType === ItemCategory.Crypto)
            }
        }, [handleInputChange, collected.bestExpectedCrypto, symbolRecentlyChanged]
    )

    const firstRender = useRef(true)
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        setSymbolRecentlyChanged(true)
    }, [collected.amountInCrypto])

    return (
        <main className={stylesCommon.body}>
            {
                generalErrors.map((errName, i) =>
                    <InfoBox key={i} in={!!errors[errName]} type='error' className={`${stylesCommon['body__child']}`}>
                        {errors[errName].message}
                        &nbsp;
                        {<button className={stylesCommon['button--link']} onClick={() => onPriceError(errName)}>Try again.</button>}
                    </InfoBox>
                )
            }
            {
                !generalErrors.some(errName => errName === "GATEWAYS") ?
                    <>
                        <InputButton onClick={openPickCrypto} className={stylesCommon['body__child']} label="I want to buy" selectedOption={selectedCrypto.name} icon={selectedCrypto.icon} />
                        <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                            <InputTextAmount error={errors['amount']?.message} name='amount' type='number' value={collected.amount} onChange={handleInputChange} className={`${stylesCommon['row-fields__child']} ${stylesCommon['grow']}`} label="Amount" symbol={selectedCurrency.symbol} placeholder="100" symbols={pairs} onSymbolChange={handleSymbolChange} />
                            <InputButton onClick={openPickCurrency} className={stylesCommon['row-fields__child']} label="Currency" selectedOption={selectedCurrency.name} icon={selectedCurrency.icon} />
                        </div>
                        <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon['body__child']} label="Payment method" selectedOption={selectedPaymentMethod.name} icon={selectedPaymentMethod.icon} />
                        <ExpectedCrypto className={`${stylesCommon['body__child']} ${stylesCommon.grow}`} amountInCrypto={amountInCrypto} denom={amountInCrypto ? selectedCurrency.name : selectedCrypto.name} isLoading={collected.isCalculatingAmount} />
                        <div className={`${stylesCommon['body__child']}`}>
                            <ButtonAction onClick={onBuyCrypto} text={`Buy ${selectedCrypto.id}`} disabled={!isFilled || collected.isCalculatingAmount || Object.keys(generalErrors).length > 0} />
                        </div>
                    </>
                    :
                    <div className={`${stylesCommon['body__child']} ${stylesCommon['grow']}`}>
                        <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
                    </div>
            }
        </main >
    )
}

const LOAGIND_TEXT = 'Loading...'
const LoadingItem: ItemType = {
    id: '',
    name: LOAGIND_TEXT
}

export default BodyBuyCrypto

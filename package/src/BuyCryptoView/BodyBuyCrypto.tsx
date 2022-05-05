import React, { useContext, useEffect, useState, useCallback, useRef } from 'react'
import stylesCommon from '../styles.module.css'

import InputButton from '../common/Input/InputButton'
import InputTextAmount from '../common/Input/InputTextAmount'
import ButtonAction from '../common/ButtonAction'
import ExpectedCrypto from './ExpectedCrypto'

import { APIContext, ItemCategory } from '../ApiContext'
import type { ItemType } from '../ApiContext'
import { NavContext } from '../NavContext'

import InfoBox from '../common/InfoBox'
import { useTranslation } from 'react-i18next'

interface BodyBuyCryptoProps {
    onBuyCrypto: () => void
    openPickCrypto?: () => void
    openPickCurrency?: () => void
    openPickPayment?: () => void
    selectedCrypto?: ItemType
    selectedCurrency?: ItemType
    selectedPaymentMethod?: ItemType
    handleInputChange: (name: string, value: any) => void
    isFilled?: boolean
}

const BodyBuyCrypto: React.FC<BodyBuyCryptoProps> = (props) => {
    const { t, i18n } = useTranslation();
    //NOTE: be aware of this if in the future changing the language without page load is wanted
    const [loadingItem, setLoadingItem] = useState<ItemType>({
        id: '',
        name: t('mainScreen.loadingText')
    });

    const { openPickCrypto, onBuyCrypto, openPickCurrency, openPickPayment } = props
    const { selectedCrypto = loadingItem, selectedCurrency = loadingItem, selectedPaymentMethod = loadingItem, isFilled = true } = props
    const { handleInputChange } = props
    const { collected } = useContext(APIContext);
    const { triggerChat } = useContext(NavContext)

    const [pairs, setPairs] = useState<ItemType[]>()
    const [amountInCrypto, setAmountInCrypto] = useState<boolean>(collected.amountInCrypto??false)
    const [symbolRecentlyChanged, setSymbolRecentlyChanged] = useState(false)

    const [minMaxErrorsMsg, setMinMaxErrorsMsg] = useState<string>()

    useEffect(() => {
        setMinMaxErrorsMsg(
            collected.errors?.RATE?.type === 'MIN'
                || collected.errors?.RATE?.type === 'MAX'
                ? collected.errors.RATE.message
                : undefined)
    }, [collected.errors])

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

    useEffect(() => {
        setLoadingItem({
            id: '',
            name: t('mainScreen.loadingText')
        });
    }, [i18n.language, t]);

    return (
        <main className={stylesCommon.body}>
            <InfoBox
                in={collected.errors?.RATE?.type === 'OTHER'} type='notification' className={`${stylesCommon.body__child}`}>
                {collected.errors?.RATE?.message}
            </InfoBox>
            <InfoBox
                onActionClick={
                    collected.errors?.RATE?.type === 'ALL_UNAVAILABLE'
                        ? onBuyCrypto
                        : collected.errors?.RATE?.type === 'NO_RATES'
                            ? triggerChat
                            : undefined
                }
                actionText={
                    collected.errors?.RATE?.type === 'ALL_UNAVAILABLE'
                        ? t('mainScreen.infoBox.seeAllGateways')
                        : collected.errors?.RATE?.type === 'NO_RATES'
                            ? t('mainScreen.infoBox.contact')
                            : undefined
                }
                in={
                    collected.errors?.RATE?.type === 'ALL_UNAVAILABLE'
                    || collected.errors?.RATE?.type === 'NO_RATES'
                }
                type='notification'
                className={`${stylesCommon.body__child}`}
            >
                {collected.errors?.RATE?.message}
            </InfoBox>
            <InputButton onClick={openPickCrypto} className={stylesCommon.body__child} label={t('mainScreen.userIntention')} selectedOption={selectedCrypto.name} icon={selectedCrypto.icon} network={selectedCrypto.network} />
            <div className={`${stylesCommon.body__child} ${stylesCommon['row-fields']}`}>
                <InputTextAmount error={minMaxErrorsMsg} name='amount' type='number' value={collected.amount} onChange={handleInputChange} className={`${stylesCommon['row-fields__child']} ${stylesCommon.grow}`} label={t('mainScreen.amount')} symbol={selectedCurrency.symbol} placeholder="100" symbols={pairs} onSymbolChange={handleSymbolChange} disabled={!collected.isAmountEditable} />
                <InputButton onClick={openPickCurrency} className={stylesCommon['row-fields__child']} label={t('mainScreen.currency')} selectedOption={selectedCurrency.name} icon={selectedCurrency.icon} />
            </div>
            <InputButton onClick={openPickPayment} iconPosition="end" className={stylesCommon.body__child} label={t('mainScreen.paymentMethod')} selectedOption={selectedPaymentMethod.name} icon={selectedPaymentMethod.icon} />
            <ExpectedCrypto
                className={`${stylesCommon.body__child} ${stylesCommon.grow}`}
                amountInCrypto={amountInCrypto}
                denom={amountInCrypto ? selectedCurrency.name : selectedCrypto.name}
                isLoading={collected.isCalculatingAmount}
            />
            <div className={`${stylesCommon.body__child}`}>
                <ButtonAction
                    onClick={onBuyCrypto}
                    text={collected.errors?.RATE?.type === 'ALL_UNAVAILABLE' ? t('mainScreen.button.viewGateways') : `${t('mainScreen.button.purchasePrefix')} ${selectedCrypto.name}`}
                    disabled={!isFilled || collected.isCalculatingAmount || !!minMaxErrorsMsg || collected.errors?.RATE?.type === 'NO_RATES'}
                />
            </div>
        </main >
    )
}

export default BodyBuyCrypto

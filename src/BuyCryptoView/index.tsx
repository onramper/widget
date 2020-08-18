import React, { useContext, useEffect, useState } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'
import { APIContext } from '../context'
import { ItemType } from '../common/types';

const BuyCryptoView: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: any } | undefined>({})
  const [selectedCrypto, setSelectedCrypto] = useState<ItemType>()
  const [selectedCurrency, setSelectedCurrency] = useState<ItemType>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<ItemType>()

  const [flagEffectRate, setFlagEffectRate] = useState(0)
  const [flagEffectGateways, setFlagEffectGateways] = useState(0)

  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface, collected, apiInterface } = useContext(APIContext);
  const { handleCryptoChange, handleCurrencyChange, handlePaymentMethodChange } = data
  const { gateways, getRates } = apiInterface

  useEffect(() => {
    setSelectedCrypto(collected.selectedCrypto)
  }, [collected.selectedCrypto])

  useEffect(() => {
    setSelectedCurrency(collected.selectedCurrency)
  }, [collected.selectedCurrency])

  useEffect(() => {
    setSelectedPaymentMethod(collected.selectedPaymentMethod)
  }, [collected.selectedPaymentMethod])

  useEffect(() => {
    async function gatewaysEffect() {
      const err = await gateways();
      processErrors(err)
    }
    gatewaysEffect()
  }, [gateways, flagEffectGateways])

  useEffect(() => {
    processErrors({ gateways: undefined })
    const err = handleCryptoChange(selectedCrypto);
    processErrors(err)
  }, [handleCryptoChange, selectedCrypto])

  useEffect(() => {
    handleCurrencyChange(selectedCurrency);
  }, [handleCurrencyChange, selectedCurrency])

  useEffect(() => {
    processErrors({ rate: undefined })
    const err = handlePaymentMethodChange(selectedPaymentMethod);
    processErrors(err)
  }, [handlePaymentMethodChange, selectedPaymentMethod, setErrors, flagEffectRate])

  useEffect(() => {
    async function getRateEffect() {
      processErrors({ rate: undefined })
      const err = await getRates();
      processErrors(err)
    }
    getRateEffect()
  }, [setErrors, flagEffectRate, getRates, collected.amountInCrypto])

  const processErrors = (err: any, by?: string) => {
    if (err)
      setErrors(prev => ({ ...prev, ...err }))
    else setErrors(undefined)
  }

  const handleItemClick = (name: string, index: number, item: ItemType) => {
    if (name === 'crypto')
      setSelectedCrypto(item)
    else if (name === 'currency')
      setSelectedCurrency(item)
    else if (name === 'paymentMethod')
      setSelectedPaymentMethod(item)
    backScreen()
  }

  useEffect(() => {
    if (selectedCrypto && selectedCurrency && selectedPaymentMethod && collected.amount > 0)
      setIsFilled(true)
    else
      setIsFilled(false)
  }, [setIsFilled, selectedCrypto, selectedCurrency, selectedPaymentMethod, collected.amount])

  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={() => nextScreen(<PickView name='crypto' title="Select cryptocurrency" items={data.availableCryptos} onItemClick={handleItemClick} searchable />)}
        openPickCurrency={() => nextScreen(<PickView name='currency' title="Select fiat currency" items={data.availableCurrencies} onItemClick={handleItemClick} searchable />)}
        openPickPayment={() => nextScreen(<PickView name='paymentMethod' title="Select payment method" items={data.availablePaymentMethods} onItemClick={handleItemClick} />)}
        selectedCrypto={selectedCrypto}
        selectedCurrency={selectedCurrency}
        selectedPaymentMethod={selectedPaymentMethod}
        handleInputChange={inputInterface.handleInputChange}
        errors={errors}
        isFilled={isFilled}
        onPriceError={(errName: string) => {
          if (errName === 'rate')
            setFlagEffectRate(prev => prev + 1)
          else if (errName === 'gateways')
            setFlagEffectGateways(prev => prev + 1)
          processErrors(undefined)
        }}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
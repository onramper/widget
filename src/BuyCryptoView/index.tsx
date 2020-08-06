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
  const { init, handleCryptoChange, handleCurrencyChange, handlePaymentMethodChange } = data
  const { getRates } = apiInterface

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
    async function initEffect() {
      const err = await init();
      processErrors(err)
    }
    initEffect()
  }, [init, flagEffectGateways])

  useEffect(() => {
    async function handleCryptoChangeEffect() {
      await handleCryptoChange(selectedCrypto);
    }
    handleCryptoChangeEffect()
  }, [handleCryptoChange, selectedCrypto])

  useEffect(() => {
    async function handleCurrencyChangeEffect() {
      await handleCurrencyChange(selectedCurrency);
    }
    handleCurrencyChangeEffect()
  }, [handleCurrencyChange, selectedCurrency])

  useEffect(() => {
    async function handlePaymentMethodChangeEffect() {
      processErrors({ rate: undefined })
      const err = await handlePaymentMethodChange(selectedPaymentMethod);
      processErrors(err)
    }
    handlePaymentMethodChangeEffect()
  }, [handlePaymentMethodChange, selectedPaymentMethod, setErrors, flagEffectRate])

  useEffect(() => {
    async function getRateEffect() {
      processErrors({ rate: undefined })
      const err = await getRates();
      console.log('called here', err)
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
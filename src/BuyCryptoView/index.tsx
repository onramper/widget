import React, { useContext, useEffect, useState } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'
import { APIContext } from '../context'

const BuyCryptoView: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: any } | undefined>({})
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState<number>(0)
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState<number>(0)
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState<number>(0)


  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface, collected } = useContext(APIContext);
  const { init, handleCryptoChange, handleCurrencyChange, handlePaymentMethodChange } = data

  const selectedCrypto = data.availableCryptos[selectedCryptoIndex]
  const selectedCurrency = data.availableCurrencies[selectedCurrencyIndex]
  const selectedPaymentMethod = data.availablePaymentMethods[selectedPaymentMethodIndex]

  useEffect(() => {
    async function initEffect() {
      await init();
    }
    initEffect()
  }, [init])

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
      const err = await handlePaymentMethodChange(selectedPaymentMethod);
      if (err) setErrors(prev => ({ ...prev, amount: {}, ...err }))
      else setErrors(undefined)
    }
    handlePaymentMethodChangeEffect()
  }, [handlePaymentMethodChange, selectedPaymentMethod, setErrors])

  const handleItemClick = (name: string, index: number) => {
    if (name === 'crypto')
      setSelectedCryptoIndex(index)
    else if (name === 'currency')
      setSelectedCurrencyIndex(index)
    else if (name === 'paymentMethod')
      setSelectedPaymentMethodIndex(index)
    backScreen()
  }

  useEffect(() => {
    if (selectedCrypto && selectedCurrency && selectedPaymentMethod && !errors && collected.amount)
      setIsFilled(true)
    else
      setIsFilled(false)
  }, [setIsFilled, selectedCrypto, selectedCurrency, selectedPaymentMethod, errors, collected.amount])

  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={() => nextScreen(<PickView name='crypto' title="Select cryptocurrency" items={data.availableCryptos} onItemClick={handleItemClick} />)}
        openPickCurrency={() => nextScreen(<PickView name='currency' title="Select fiat currency" items={data.availableCurrencies} onItemClick={handleItemClick} />)}
        openPickPayment={() => nextScreen(<PickView name='paymentMethod' title="Select payment method" items={data.availablePaymentMethods} onItemClick={handleItemClick} />)}
        selectedCrypto={selectedCrypto}
        selectedCurrency={selectedCurrency}
        selectedPaymentMethod={selectedPaymentMethod}
        handleInputChange={inputInterface.handleInputChange}
        errors={errors}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
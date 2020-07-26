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
  const [errors, setErrors] = useState({})
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0)
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(0)
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(0)


  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface } = useContext(APIContext);
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
      setErrors(prev => ({ ...prev, amount: {}, ...err }))
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

  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={() => nextScreen(<PickView name='crypto' title="Select cryptocurrency" items={data.availableCryptos} onItemClick={handleItemClick} />)}
        openPickCurrency={() => nextScreen(<PickView name='currency' title="Select fiat currency" items={data.availableCurrencies} onItemClick={handleItemClick} />)}
        openPickPayment={() => nextScreen(<PickView name='paymentMethod' title="Select payment method" items={data.availablePaymentMethods} onItemClick={handleItemClick} />)}
        selectedCrypto={data.availableCryptos[selectedCryptoIndex]}
        selectedCurrency={data.availableCurrencies[selectedCurrencyIndex]}
        selectedPaymentMethod={data.availablePaymentMethods[selectedPaymentMethodIndex]}
        handleInputChange={inputInterface.handleInputChange}
        errors={errors}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
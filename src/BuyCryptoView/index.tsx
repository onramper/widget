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
  /* const [expectedAmount, setExpectedAmount] = useState(0) */
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0)
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(0)
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(0)


  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface } = useContext(APIContext);
  const { handleInputChange } = inputInterface
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
      await handleCryptoChange(selectedCrypto?.id);
    }
    handleCryptoChangeEffect()
  }, [handleCryptoChange, selectedCrypto])

  useEffect(() => {
    async function handleCurrencyChangeEffect() {
      await handleCurrencyChange(selectedCurrency?.id);
    }
    handleCurrencyChangeEffect()
  }, [handleCurrencyChange, selectedCurrency])

  useEffect(() => {
    async function handlePaymentMethodChangeEffect() {
      await handlePaymentMethodChange(selectedPaymentMethod?.id);
    }
    handlePaymentMethodChangeEffect()
  }, [handlePaymentMethodChange, selectedPaymentMethod])

  const handleItemClick = (index: number, name: string) => {
    if (name === 'crypto')
      setSelectedCryptoIndex(index)
    else if (name === 'currency')
      setSelectedCurrencyIndex(index)
    else if (name === 'paymentMethod')
      setSelectedPaymentMethodIndex(index)
    backScreen()
  }

  useEffect(() => {
    handleInputChange('selectedCrypto', selectedCryptoIndex)
  }, [handleInputChange, selectedCryptoIndex])

  useEffect(() => {
    handleInputChange('selectedCurrency', selectedCurrencyIndex)
  }, [handleInputChange, selectedCurrencyIndex])

  useEffect(() => {
    handleInputChange('selectedPaymentMethod', selectedPaymentMethodIndex)
  }, [handleInputChange, selectedPaymentMethodIndex])

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
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
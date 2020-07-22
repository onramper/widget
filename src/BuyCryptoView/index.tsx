import React, { useContext, useEffect, useState } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'
import { APIContext } from '../wrappers/APIContext'

const BuyCryptoView: React.FC = () => {
  /* const [expectedAmount, setExpectedAmount] = useState(0) */
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0)
  const [selectedCurrencyIndex, setSelectedCurrencyIndex] = useState(0)
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(0)


  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface } = useContext(APIContext);
  const { handleInputChange } = inputInterface
  const { init, onCryptoChange, onCurrencyChange, onPaymentMethodChange } = data

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
    async function onCryptoChangeEffect() {
      await onCryptoChange(selectedCrypto?.name);
    }
    onCryptoChangeEffect()
  }, [onCryptoChange, selectedCrypto])

  useEffect(() => {
    async function onCurrencyChangeEffect() {
      await onCurrencyChange(selectedCurrency?.name);
    }
    onCurrencyChangeEffect()
  }, [onCurrencyChange, selectedCurrency])

  useEffect(() => {
    async function onPaymentMethodChangeEffect() {
      await onPaymentMethodChange(selectedPaymentMethod?.name);
    }
    onPaymentMethodChangeEffect()
  }, [onPaymentMethodChange, selectedPaymentMethod])

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
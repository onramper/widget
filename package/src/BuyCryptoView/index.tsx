import React, { useContext, useEffect, useState } from 'react';
import Header from '../common/Header'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'
import ErrorView from '../common/ErrorView'

import { NavContext } from '../NavContext'
import { APIContext, ItemType } from '../ApiContext'

const BuyCryptoView: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false)
  const [localErrors, setErrors] = useState<{ [key: string]: any } | undefined>({})

  const [flagEffectInit, setFlagEffectInit] = useState(0)

  const { nextScreen, backScreen } = useContext(NavContext);
  const { data, inputInterface, collected, apiInterface } = useContext(APIContext);
  const { handleCryptoChange, handleCurrencyChange, handlePaymentMethodChange } = data
  const { init, getRates } = apiInterface
  const { errors } = collected

  //flagEffectInit used to call init again
  useEffect(() => {
    init();
  }, [init, flagEffectInit])

  const handleItemClick = (name: string, index: number, item: ItemType) => {
    if (name === 'crypto')
      handleCryptoChange(item)
    else if (name === 'currency')
      handleCurrencyChange(item)
    else if (name === 'paymentMethod')
      handlePaymentMethodChange(item)

    backScreen()
  }

  useEffect(() => {
    setErrors(errors)
    if (errors?.GATEWAYS)
      nextScreen(<ErrorView />)
  }, [errors, nextScreen])

  useEffect(() => {
    if (collected.selectedCrypto && collected.selectedCurrency && collected.selectedPaymentMethod && collected.amount > 0)
      setIsFilled(true)
    else
      setIsFilled(false)
  }, [setIsFilled, collected.selectedCrypto, collected.selectedCurrency, collected.selectedPaymentMethod, collected.amount])

  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={data.availableCryptos.length > 1 ? () => nextScreen(<PickView name='crypto' title="Select cryptocurrency" items={data.availableCryptos} onItemClick={handleItemClick} searchable />) : undefined}
        openPickCurrency={data.availableCurrencies.length > 1 ? () => nextScreen(<PickView name='currency' title="Select fiat currency" items={data.availableCurrencies} onItemClick={handleItemClick} searchable />) : undefined}
        openPickPayment={data.availablePaymentMethods.length > 1 ? () => nextScreen(<PickView name='paymentMethod' title="Select payment method" items={data.availablePaymentMethods} onItemClick={handleItemClick} />) : undefined}
        selectedCrypto={collected.selectedCrypto}
        selectedCurrency={collected.selectedCurrency}
        selectedPaymentMethod={collected.selectedPaymentMethod}
        handleInputChange={inputInterface.handleInputChange}
        errors={localErrors}
        isFilled={isFilled}
        onPriceError={(errName: string) => {
          if (errName === 'RATE')
            getRates()
          else if (errName === 'GATEWAYS')
            setFlagEffectInit(prev => prev + 1)
        }}
      />
    </div>
  );
};

export default BuyCryptoView;

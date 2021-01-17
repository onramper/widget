import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css'
import stylesCommon from '../../styles.module.css'
import { COUNTRY_NOT_SUPPORTED, DISABLED_GATEWAYS, API_ERROR } from './errors'

import Header from '../../common/Header'
import { NavContext } from '../../NavContext'
import BuyCryptoView from '../../BuyCryptoView'
import { APIContext } from '../../ApiContext';

interface ErrorViewProps {
  buttonText?: string
  maxHeight?: string
  fixedHeight?: boolean
  type?: "API" | "NO_GATEWAYS" | "DISABLED_GATEWAYS" | "NO_CRYPTOS" | "NO_FIAT" | "NO_PAYMENT_METHODS" | "NO_RATES" | "MIN" | "MAX" | "UNREACHABLE" | "OTHER" | "ALL_UNAVAILABLE" | undefined
  message?: string
}

const ErrorView: React.FC<ErrorViewProps> = (props) => {
  const { onlyScreen } = useContext(NavContext)
  const { apiInterface, collected } = useContext(APIContext)

  const [isRestartCalled, setIsRestartCalled] = useState(false)

  const restartWidget = () => {
    apiInterface.clearErrors()
    setIsRestartCalled(true)
  }

  useEffect(() => {
    if (isRestartCalled && !collected.errors) {
      onlyScreen(<BuyCryptoView />)
      setIsRestartCalled(false)
    }
  }, [collected.errors, isRestartCalled, onlyScreen])

  const CurrentError = (() => {
    switch (props.type) {
      case 'NO_GATEWAYS':
        return COUNTRY_NOT_SUPPORTED(collected.selectedCountry)
      case 'DISABLED_GATEWAYS':
        return DISABLED_GATEWAYS
      case 'API':
        return API_ERROR(props.message ?? '', restartWidget)
      default:
        return API_ERROR(props.message ?? '', restartWidget)
    }
  })()

  return (
    <div className={stylesCommon.view}>
      <Header title="" noSeparator />
      <div className={`${stylesCommon.body} ${styles.body}`}>
        {CurrentError}
      </div>
    </div >
  );
};

export default ErrorView;

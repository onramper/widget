import React, { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css'
import stylesCommon from '../../styles.module.css'
import { TX_ERROR } from './errors'

import Header from '../../common/Header'
import ButtonAction from '../ButtonAction'
import { NavContext } from '../../NavContext'
import BuyCryptoView from '../../BuyCryptoView'
import { APIContext } from '../../ApiContext';

interface ErrorViewProps {
  buttonText?: string
  maxHeight?: string
  fixedHeight?: boolean
  type?: 'TX' | 'GENERIC' | 'GATEWAYS' | 'RATES'
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

  const currentError = (() => {
    switch (props.type) {
      case 'TX':
        return TX_ERROR
      default:
        return TX_ERROR
    }
  })()

  return (
    <div className={stylesCommon.view}>
      <Header title="" noSeparator />
      <div className={`${stylesCommon.body} ${styles.body}`}>
        <div className={styles['body-content']}>
          <currentError.illustration className={styles['content-image']} />
          <span className={styles['content-title']}>{currentError.title}</span>
          <span className={styles['content-description']}>
            {currentError.description}
          </span>
        </div>
        <div className={styles['body-content']}>
          <ButtonAction text="Try another gateway" size='small' onClick={restartWidget} />
          <a className={styles['content-link']} target='_blank' rel="noreferrer" href="https://onramper.com/FAQ/">Read our FAQs</a>
        </div>
      </div>
    </div>
  );
};

export default ErrorView;

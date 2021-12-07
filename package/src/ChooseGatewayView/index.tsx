import React, { useContext, useState, useEffect } from 'react';
import Header from '../common/Header'
import styles from '../styles.module.css'
import BodyChooseGateway from './BodyChooseGateway'
import { NavContext } from '../NavContext'
import { APIContext, GatewayRateOption } from '../ApiContext'

import Step from '../steps/Step'
import { useTranslation } from 'react-i18next';

/* import WalletAddressView from '../steps/WalletAddressView' */

const ChooseGatewayView = () => {
  const { t } = useTranslation();

  const { nextScreen } = useContext(NavContext)
  const { data, inputInterface } = useContext(APIContext)
  const { handleInputChange } = inputInterface

  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(0)
  const [availableRates, setAvailableRates] = useState<GatewayRateOption[]>([])

  useEffect(() => {
    const availableRates = data.allRates.filter(g => g.available)
    setAvailableRates(availableRates)
  }, [data.allRates])

  useEffect(() => {
    handleInputChange('selectedGateway', availableRates[selectedGatewayIndex])
  }, [handleInputChange, selectedGatewayIndex, availableRates])

  const isWyreStep = () => {
    const nextStep = availableRates[selectedGatewayIndex].nextStep
    if (!nextStep) return false
    return (
      availableRates[selectedGatewayIndex].identifier === 'Wyre'
      && nextStep.type === 'form'
      && nextStep.data.some(field => field.name === 'ccNumber')
    )
  }

  return (
    <div className={styles.view}>
      <Header title={t('header.chooseSeller')} backButton />
      <BodyChooseGateway
        onItemClick={(i) => setSelectedGatewayIndex(i)}
        ratesList={data.allRates}
        onActionButton={
          () => nextScreen(
            <Step
              nextStep={availableRates[selectedGatewayIndex].nextStep!}
              isConfirmed={!isWyreStep()}
            />)
        }
      />
    </div>
  );
};

export default ChooseGatewayView;

import React, { useContext, useState, useEffect } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import styles from '../styles.module.css'
import BodyChooseGateway from './BodyChooseGateway'
import { NavContext } from '../wrappers/context'
import { APIContext } from '../context'

import WalletAddressView from '../steps/WalletAddressView'

import { GatewayOptionType } from './GatewayOption'

const ChooseGatewayView = () => {
  const { nextScreen } = useContext(NavContext)
  const { data, inputInterface } = useContext(APIContext)
  const { handleInputChange } = inputInterface

  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(0)
  const [ratedGateways, setRatedGateways] = useState<GatewayOptionType[]>([])

  useEffect(() => {
    const ratedGateways = data.availableRates.filter((g) => g.available)
    setRatedGateways(ratedGateways)
  }, [data.availableRates])

  useEffect(() => {
    handleInputChange('selectedGateway', ratedGateways[selectedGatewayIndex])
    handleInputChange('nextStep', ratedGateways[selectedGatewayIndex].nextStep)
  }, [handleInputChange, selectedGatewayIndex, ratedGateways])

  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <BodyChooseGateway onItemClick={(i) => setSelectedGatewayIndex(i)} availableGateways={data.availableRates} onActionButton={() => nextScreen(<WalletAddressView />)} />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
import React, { useContext, useState, useEffect } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import styles from '../styles.module.css'
import BodyChooseGateway from './BodyChooseGateway'
import { NavContext } from '../wrappers/context'
import { APIContext } from '../context'

import WalletAddressView from '../steps/WalletAddressView'


const ChooseGatewayView = () => {
  const { nextScreen } = useContext(NavContext)
  const { data, inputInterface } = useContext(APIContext)
  const { handleInputChange } = inputInterface

  const [selectedGatewayIndex, setSelectedGatewayIndex] = useState(0)

  useEffect(() => {
    handleInputChange('selectedGateway', data.availableRates[selectedGatewayIndex])
  }, [handleInputChange, selectedGatewayIndex, data.availableRates])

  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <BodyChooseGateway onItemClick={(i) => setSelectedGatewayIndex(i)} availableGateways={data.availableRates} onActionButton={() => nextScreen(<WalletAddressView />)} />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
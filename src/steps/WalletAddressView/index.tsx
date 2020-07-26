import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWalletAddress from './BodyWalletAddress'
import styles from '../../styles.module.css'

import nextStep from '../nextStep'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const WalletAddressView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, data, collected } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)

  const handleButtonAction = () => {
    if (!collected.walletAddress || !data.nextStep) return
    nextStep(nextScreen, data.nextStep)
  }

  useEffect(() => {
    const isFilled = collected.walletAddress ? true : false
    setIsFilled(isFilled)
  }, [collected.walletAddress])

  return (
    <div className={styles.view}>
      <Header title="Wallet address" backButton />
      <BodyWalletAddress
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default WalletAddressView;
import React, { useContext } from 'react';
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

  const handleButtonAction = () => {
    if (!collected.walletAddress) return
    nextStep(nextScreen, data.nextStep)
  }

  return (
    <div className={styles.view}>
      <Header title="Wallet address" backButton />
      <BodyWalletAddress
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default WalletAddressView;
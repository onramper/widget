import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWalletAddress from './BodyWalletAddress'
import Step from '../Step'
import styles from '../../styles.module.css'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

/* import PersonalDetailsView from './../PersonalDetailsView' */

const WalletAddressView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)

  const handleButtonAction = () => {
    if (!collected.cryptocurrencyAddress) return
    if (collected.selectedGateway?.nextStep)
      nextScreen(<Step nextStep={collected.selectedGateway.nextStep} />)
  }

  useEffect(() => {
    const isFilled = collected.cryptocurrencyAddress ? true : false
    setIsFilled(isFilled)
  }, [collected.cryptocurrencyAddress])

  return (
    <div className={styles.view}>
      <Header title="Wallet address" backButton />
      <BodyWalletAddress
        onActionButton={handleButtonAction}//{() => nextScreen(<PersonalDetailsView />)}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default WalletAddressView;
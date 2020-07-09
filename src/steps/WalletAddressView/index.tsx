import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWalletAddress from './BodyWalletAddress'
import styles from '../../styles.module.css'
import PersonalDetailsView from '../PersonalDetailsView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../wrappers/APIContext'

const WalletAddressView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Wallet address" backButton />
      <BodyWalletAddress
        onButtonAction={() => nextScreen(<PersonalDetailsView />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default WalletAddressView;
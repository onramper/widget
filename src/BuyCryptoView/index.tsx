import React, { useContext } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickCryptoScreen from '../PickCryptoScreen'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'

const BuyCryptoView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        onPickCrypto={() => nextScreen(<PickCryptoScreen />)}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
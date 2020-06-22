import React, { useContext } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'
import PickView from '../PickView'
import ChooseGatewayView from '../ChooseGatewayView'

import { NavContext } from '../wrappers/context'
import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'

const availableCryptos = [
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconUSD,
    name: "USD",
    info: "US Dollar"
  },
]

const BuyCryptoView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        openPickCrypto={() => nextScreen(<PickView title="Select cryptocurrency" items={availableCryptos} />)}
        openPickCurrency={() => nextScreen(<PickView title="Select fiat currency" items={[]} />)}
        openPickPayment={() => nextScreen(<PickView title="Select payment method" items={[]} />)}
      />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
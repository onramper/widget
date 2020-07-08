import React, { useContext } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'
import LogoMoonPay from '../icons/moonpay.svg'
import LogoCryptoCoinPro from '../icons/cryptocoinpro.png'
import BodyChooseGateway from './BodyChooseGateway'
import { NavContext } from '../wrappers/context'

import PersonalDetailsView from '../steps/PersonalDetailsView'

const availableGateways = [
  {
    name: "Recommended",
    txTime: "3-5h",
    kycLevel: "medium",
    amount: 100,
    denom: "BTC",
    fee: 2,
    logo: LogoMoonPay
  },
  {
    name: "Fastest",
    txTime: "3-5h",
    kycLevel: "hard",
    amount: 99,
    denom: "BTC",
    fee: 4,
    logo: LogoCryptoCoinPro
  }
]

const ChooseGatewayView = () => {
  const { nextScreen } = useContext(NavContext)

  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <BodyChooseGateway availableGateways={availableGateways} onActionButton={() => nextScreen(<PersonalDetailsView />)} />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
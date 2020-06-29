import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'
import GatewaysList from './GatewaysList'

const availableGateways = [
  {
    id: 1,
    name: "Recommended",
    txTime: "3-5h",
    kycLevel: "medium",
    amount: 1.026546,
    denom: "BTC",
    fee: 2,
    logo: LogoOnramper
  },
  {
    id: 2,
    name: "Fastest",
    txTime: "3-5h",
    kycLevel: "hard",
    amount: 1.026546,
    denom: "BTC",
    fee: 4,
    logo: LogoOnramper
  }
]

const a = (i: number) => {
  console.log(i)
}

const ChooseGatewayView = () => {
  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <GatewaysList items={availableGateways} onClick={a} />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'
import GatewaysList from './GatewaysList'

const availableGateways = [
  {
    name:"Recommended",
    txTime: "3-5h",
    kycLevel: "medium",
    amount: 1.026546,
    denom: "BTC",
    fee: 2,
    logo: LogoOnramper,
    open: true
  },
  {
    name:"Fastest",
    txTime: "3-5h",
    kycLevel: "hard",
    amount: 1.026546,
    denom: "BTC",
    fee: 4,
    logo: LogoOnramper
  }
]

const a = (a: any, b: any, c: any) => {
  console.log(a, b, c)
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
import React from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import GatewayOption from '../components/GatewayOption'
import styles from '../styles.module.css'
import LogoOnramper from '../icons/logo.svg'

const ChooseGatewayView = () => {
  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <GatewayOption txTime="3-5h" kycLevel="medium" amount={1.5} denom="BTC" fee={2} logo={LogoOnramper} open />
      <GatewayOption txTime="3-5h" kycLevel="medium" amount={1.5} denom="BTC" fee={2} logo={LogoOnramper} />
      <GatewayOption txTime="3-5h" kycLevel="medium" amount={1.5} denom="BTC" fee={2} logo={LogoOnramper} />
      <GatewayOption txTime="3-5h" kycLevel="medium" amount={1.5} denom="BTC" fee={2} logo={LogoOnramper} />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
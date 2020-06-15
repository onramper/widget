import React from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import GatewayOption from '../components/GatewayOption'
import styles from '../styles.module.css'

const ChooseGatewayView = () => {
  return (
    <div className={styles.view}>
      <Header title="Choose gateway" backButton />
      <GatewayOption txTime="3-5h" kycLevel="medium" open/>
      <GatewayOption txTime="3-5h" kycLevel="medium" />
      <GatewayOption txTime="3-5h" kycLevel="medium" />
      <GatewayOption txTime="3-5h" kycLevel="medium" />
      <Footer />
    </div>
  );
};

export default ChooseGatewayView;
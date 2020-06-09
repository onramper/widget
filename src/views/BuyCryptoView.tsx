import React from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import MainBuyCrypto from '../components/SelectCrypto'
import styles from '../styles.module.css'

const BuyCryptoView = () => {
  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <MainBuyCrypto />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
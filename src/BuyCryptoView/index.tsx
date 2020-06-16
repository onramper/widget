import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import MainBuyCrypto from './SelectCrypto'
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
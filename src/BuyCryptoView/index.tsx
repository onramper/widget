import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import BodyBuyCrypto from './BodyBuyCrypto'
import styles from '../styles.module.css'

const BuyCryptoView = () => {
  return (
    <div className={styles.view}>
      <Header title="Buy crypto" />
      <BodyBuyCrypto />
      <Footer />
    </div>
  );
};

export default BuyCryptoView;
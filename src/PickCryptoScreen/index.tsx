import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from './List'
import styles from '../styles.module.css'
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

const PickCryptoView = () => {
  return (
    <main className={styles.view}>
      <Header backButton title="Select cryptocurrency" />
      <List items={availableCryptos} />
      <Footer />
    </main>
  );
};

export default PickCryptoView;

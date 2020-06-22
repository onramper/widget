import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from './List'
import styles from '../styles.module.css'

const PickView: React.FC<{ title: string, items: any[] }> = (props) => {
  const { title, items } = props
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List items={items} />
      <Footer />
    </main>
  );
};

export default PickView;

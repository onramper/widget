import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from './List'
import styles from '../styles.module.css'

type PickViewType = {
  title: string,
  items: any[]
  onItemClick?: (index: number) => void
}

const PickView: React.FC<PickViewType> = (props) => {
  const { title, items } = props
  const { onItemClick = () => null } = props
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List onItemClick={onItemClick} items={items} />
      <Footer />
    </main>
  );
};

export default PickView;

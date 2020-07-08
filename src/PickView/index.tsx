import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from './List'
import styles from '../styles.module.css'

type PickViewType = {
  title: string,
  items: any[]
  onItemClick?: (name: string, index: number) => void
  name?: string
}

const PickView: React.FC<PickViewType> = (props) => {
  const { title, items, name = '' } = props
  const { onItemClick = () => null } = props
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List onItemClick={(index) => onItemClick(name, index)} items={items} />
      <Footer />
    </main>
  );
};

export default PickView;

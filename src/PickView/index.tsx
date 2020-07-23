import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from '../common/List'
import styles from '../styles.module.css'

import { ListItemType } from '../common/types'

type PickViewType = {
  title: string,
  items: ListItemType[]
  onItemClick?: (index: number, name: string) => void
  name?: string
}

const PickView: React.FC<PickViewType> = (props) => {
  const { title, items, name = '' } = props
  const { onItemClick = () => null } = props
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List onItemClick={(index) => onItemClick(index, name)} items={items} />
      <Footer />
    </main>
  );
};

export default PickView;

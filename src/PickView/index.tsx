import React from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from '../common/List'
import styles from '../styles.module.css'

import { ListItemType } from '../common/types'

type PickViewType = {
  title: string,
  items: ListItemType[]
  onItemClick?: (name: string, index: number, item: ListItemType) => void
  name?: string
  searchable?: boolean
}

const PickView: React.FC<PickViewType> = (props) => {
  const { title, items, name = '', searchable = false } = props
  const { onItemClick = () => null } = props
  return (
    <main className={styles.view}>
      <Header backButton title={title} />
      <List onItemClick={(index, item) => onItemClick(name, index, item)} items={items} searchable={searchable} />
      <Footer />
    </main>
  );
};

export default PickView;

import React, { useContext } from 'react';
import Header from '../common/Header'
import Footer from '../common/Footer'
import List from './List'
import styles from '../styles.module.css'

import { NavContext } from '../wrappers/context'

type MenuType = {
  onItemClick?: (index: number) => void
}

const Menu: React.FC<MenuType> = (props) => {
  const { backScreen } = useContext(NavContext)
  const { onItemClick = () => null } = props
  return (
    <main className={styles.view}>
      <Header title="Menu" onMenuClick={() => backScreen()} />
      <List onItemClick={onItemClick} items={[
        {
          name: 'Language',
        },
        {
          name: 'Privacy Policy',
        },
        {
          name: 'About Onramper',
        }
      ]} />
      <Footer />
    </main>
  );
};

export default Menu;

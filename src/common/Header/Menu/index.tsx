import React, { useContext } from 'react';
import Header from '..'
import Footer from '../../Footer'
import List from '../../List'
import styles from '../../../styles.module.css'

import { NavContext } from '../../../wrappers/context'


const Menu: React.FC = () => {
  const { backScreen } = useContext(NavContext)

  const handleItemClick = (i: number) => {
    switch (i) {
      case 0:
        window.open("https://onramper.com/FAQ")
        break;
      case 1:
        window.open("https://onramper.com/privacy-policy")
        break;
      case 2:
        window.open("https://onramper.com/")
        break;
      default:
        break;
    }
  }

  return (
    <main className={styles.view}>
      <Header title="Menu" onMenuClick={() => backScreen()} />
      <List onItemClick={handleItemClick} items={[
        {
          name: 'FAQ/support',
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

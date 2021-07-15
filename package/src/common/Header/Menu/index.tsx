import React, { useContext } from 'react';
import Header from '..'
import List from '../../List'
import styles from '../../../styles.module.css'

import { NavContext } from '../../../NavContext'


const Menu: React.FC = () => {
  const { backScreen/* , triggerChat */ } = useContext(NavContext)

  const handleItemClick = (i: number) => {
    switch (i) {
      case 0:
        window.open("https://onramper.com/FAQ")
        break;
      case 1:
        window.open("https://onramper.com/privacy-policy")
        break;
      case 2:
        window.open("https://onramper.com/terms-of-use/")
        break;
     /*  case 3:
        backScreen()
        triggerChat()
        break; */
      // WHEN ADDING CHAT BACK, MAKE SURE TO CHANGE FIX THE IDS!!!
      case 3:
        window.open("https://onramper.com/about")
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
          id: 'faq',
          name: 'FAQ/support'
        },
        {
          id: 'legal',
          name: 'Privacy Policy'
        },
        {
          id: 'terms',
          name: 'Terms of use'
        },
/*         {
          id: 'liveChat',
          name: 'Live chat'
        }, */
        {
          id: 'about',
          name: 'About Onramper'
        }
      ]} />
    </main>
  );
};

export default Menu;

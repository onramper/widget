import React, { useContext } from 'react';
import Header from '..'
import List from '../../List'
import styles from '../../../styles.module.css'

import { NavContext } from '../../../NavContext'
import { useTranslation } from 'react-i18next';


const Menu: React.FC = () => {
  const { t } = useTranslation();

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
      <Header title={t('menu.title')} onMenuClick={() => backScreen()} />
      <List onItemClick={handleItemClick} items={[
        {
          id: 'faq',
          name: t('menu.faq')
        },
        {
          id: 'legal',
          name: t('menu.legal')
        },
        {
          id: 'terms',
          name: t('menu.terms')
        },
/*         {
          id: 'liveChat',
          name: t('menu.liveChat')
        }, */
        {
          id: 'about',
          name: t('menu.about')
        }
      ]} />
    </main>
  );
};

export default Menu;

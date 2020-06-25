import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import CreditCardView from './steps/CreditCardView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';
import { APIProvider } from './wrappers/APIContext'

function App() {
  return (
    <APIProvider>
      <NavProvider>
        <div className={`${styles['views-container']}`}>
          <NavContainer home={<CreditCardView />} />
        </div>
      </NavProvider>
    </APIProvider>
  );
}

export default App;

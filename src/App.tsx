import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';
import { APIProvider } from './wrappers/APIContext'

function App() {
  return (
    <APIProvider>
      <NavProvider>
        <div className={`${styles['theme']} ${styles['views-container']}`}>
          <NavContainer home={<BuyCryptoView />} />
        </div>
      </NavProvider>
    </APIProvider>
  );
}

export default App;

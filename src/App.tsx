import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';

function App() {
  return (
    <NavProvider>
      <div className={`${styles['views-container']}`}>
        <NavContainer home={<BuyCryptoView />} />
      </div>
    </NavProvider>
  );
}

export default App;

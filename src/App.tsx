import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { NavProvider } from './wrappers/context';

function App() {
  return (
    <div className={`${styles.app}`}>
      <NavProvider home={<BuyCryptoView />} />
    </div>
  );
}

export default App;

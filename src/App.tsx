import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import styles from './styles.module.css'
import { AppProvider } from './wrappers/context';

function App() {
  return (
    <div className={`${styles.app}`}>
      <AppProvider>
        <BuyCryptoView />
      </AppProvider>
    </div>
  );
}

export default App;

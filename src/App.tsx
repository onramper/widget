import React from 'react';
import BuyCryptoView from './BuyCryptoView'
import ChooseGatewayView from './ChooseGatewayView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';
import { APIProvider } from './wrappers/APIContext'

function App() {
  return (
    <APIProvider>
      <NavProvider>
        <div className={`${styles['views-container']}`}>
          <NavContainer home={<ChooseGatewayView />} />
        </div>
      </NavProvider>
    </APIProvider>
  );
}

export default App;

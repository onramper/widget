import React from 'react';
import ConfirmPaymentView from './steps/ConfirmPaymentView'
import styles from './styles.module.css'
import { NavProvider, NavContainer } from './wrappers/context';
import { APIProvider } from './wrappers/APIContext'

function App() {
  return (
    <APIProvider>
      <NavProvider>
        <div className={`${styles['views-container']}`}>
          <NavContainer home={<ConfirmPaymentView />} />
        </div>
      </NavProvider>
    </APIProvider>
  );
}

export default App;

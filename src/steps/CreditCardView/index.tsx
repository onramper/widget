import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyCreditCard from './BodyCreditCard'
import styles from '../../styles.module.css'
import WireTranserView from '../WireTranserView'

import { APIContext } from '../../wrappers/APIContext'
import { NavContext } from '../../wrappers/context'

const CreditCardView: React.FC = () => {

  const { api } = useContext(APIContext);
  const { nextScreen } = useContext(NavContext);

  return (
    <div className={styles.view}>
      <Header title="Card details" backButton />
      <BodyCreditCard
        onButtonAction={() => nextScreen(<WireTranserView />)}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
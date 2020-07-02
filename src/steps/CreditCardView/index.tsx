import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyCreditCard from './BodyCreditCard'
import styles from '../../styles.module.css'

import { APIContext } from '../../wrappers/APIContext'

const CreditCardView: React.FC = () => {

  const { api } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Card details" backButton />
      <BodyCreditCard
        onButtonAction={() => null}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
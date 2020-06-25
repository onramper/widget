import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyCreditCard from './BodyCreditCard'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../wrappers/APIContext'

const CreditCardView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { api } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Card details" backButton/>
      <BodyCreditCard
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
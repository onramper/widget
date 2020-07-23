import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyCreditCard from './BodyCreditCard'
import styles from '../../styles.module.css'
import WireTranserView from '../WireTranserView'

import { APIContext } from '../../context'
import { NavContext } from '../../wrappers/context'

const CreditCardView: React.FC = () => {

  const { inputInterface } = useContext(APIContext);
  const { nextScreen } = useContext(NavContext);

  return (
    <div className={styles.view}>
      <Header title="Card details" backButton />
      <BodyCreditCard
        onButtonAction={() => nextScreen(<WireTranserView />)}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
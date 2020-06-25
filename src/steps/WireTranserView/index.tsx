import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWireTransfer from './BodyWireTransfer'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'

const CreditCardView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);

  return (
    <div className={styles.view}>
      <Header title="Wire transfer details" backButton/>
      <BodyWireTransfer
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        amount={'100,00'}
        reference={'Text'}
        iban={'NL91 ABNA 0417 1643 00'}
        bicswift={'INGBNL2A'}
        namne={'Onramper'}
        symbol={'$'}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
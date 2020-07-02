import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyConfirmPayment from './BodyConfirmPayment'
import styles from '../../styles.module.css'
import CreditCardView from '../CreditCardView'

import { NavContext } from '../../wrappers/context'

import LogoOnramper from '../../icons/btc.svg'

const ConfirmPaymentView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);

  return (
    <div className={styles.view}>
      <Header title="Payment confirmation" backButton />
      <BodyConfirmPayment
        onButtonAction={() => nextScreen(<CreditCardView />)}
        payAmount={100} //: string
        fees={7.5} //: string
        currency='USD'
        cryptoAmount={0.0568} //: number
        cryptoDenom='BTC' //: string
        txTime='3-5 hours' //: string
        cryptoAddr='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' //: string
        cryptoIcon={LogoOnramper}
        conversionRate={0.051} //: string
        gatewayFee='5.5%' //: string
        onramperFee='2%' //: string
      />
      <Footer />
    </div>
  );
};

export default ConfirmPaymentView;
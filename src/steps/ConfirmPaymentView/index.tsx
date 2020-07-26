import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyConfirmPayment from './BodyConfirmPayment'
import styles from '../../styles.module.css'
import CreditCardView from '../CreditCardView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const ConfirmPaymentView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { collected, data } = useContext(APIContext);
  const selectedGateway = collected.selectedGateway
  const selectedCrypto = collected.selectedCrypto
  const selectedCurrency = collected.selectedCurrency
  const selectedPaymentMethod = collected.selectedPaymentMethod

  return (
    <div className={styles.view}>
      <Header title="Payment confirmation" backButton />
      <BodyConfirmPayment
        onActionButton={() => nextScreen(<CreditCardView />)}
        payAmount={(collected.amount).toFixed(2)} //: string
        fees={selectedGateway?.fees} //: string
        currency={selectedCurrency?.name}
        cryptoAmount={selectedGateway?.receivedCrypto || 0}
        cryptoDenom={selectedCrypto?.name || ''} //: string
        txTime={selectedGateway?.txTime} //: string //todo MAKE IT BETTER, ONLY FOR DEMO PURPOSES
        cryptoAddr={collected?.walletAddress} //: string
        cryptoIcon={selectedCrypto?.icon}
        paymentMethod={selectedPaymentMethod?.name}
        conversionRate={selectedGateway?.rate} //: string
      />
      <Footer />
    </div>
  );
};

export default ConfirmPaymentView;
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
  const selectedGateway = data.availableRates[collected.selectedGateway]
  const selectedCrypto = data.availableCryptos[collected.selectedCrypto]
  const selectedCurrency = data.availableCurrencies[collected.selectedCurrency]
  const selectedPaymentMethod = data.availablePaymentMethods[collected.selectedPaymentMethod]

  return (
    <div className={styles.view}>
      <Header title="Payment confirmation" backButton />
      <BodyConfirmPayment
        onButtonAction={() => nextScreen(<CreditCardView />)}
        payAmount={(collected.amount).toFixed(2)} //: string
        fee={selectedGateway.fees} //: string
        currency={selectedCurrency.name}
        cryptoAmount={selectedGateway.receivedCrypto}
        cryptoDenom={selectedCrypto.name} //: string
        txTime={`${selectedGateway.txTime.slice(0, -1)} hours`} //: string //todo MAKE IT BETTER, ONLY FOR DEMO PURPOSES
        cryptoAddr={collected.walletAddress} //: string
        cryptoIcon={selectedCrypto.icon}
        paymentMethod={selectedPaymentMethod.name}
        conversionRate={selectedGateway.rate} //: string
      /*         gatewayFee='5.5%' //: string
              onramperFee='2%' //: string */
      />
      <Footer />
    </div>
  );
};

export default ConfirmPaymentView;
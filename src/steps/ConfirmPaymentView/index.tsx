import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyConfirmPayment from './BodyConfirmPayment'
import styles from '../../styles.module.css'
import CreditCardView from '../CreditCardView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'
import { NextStep } from '../../common/types';

const ConfirmPaymentView: React.FC<{ nextStep: NextStep }> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  const [isFilled, setIsFilled] = useState(false)

  useEffect(() => {
    setIsFilled(collected.agreementCheckbox)
  }, [setIsFilled, collected.agreementCheckbox])

  return (
    <div className={styles.view}>
      <Header title="Payment confirmation" backButton />
      <BodyConfirmPayment
        onActionButton={() => nextScreen(<CreditCardView  />)}
        payAmount={collected.amount.toString()}
        fees={collected.selectedGateway?.fees}
        currency={collected.selectedCurrency?.name}
        cryptoAmount={collected.selectedGateway?.receivedCrypto || 0}
        cryptoDenom={collected.selectedCrypto?.name || ''}
        txTime={collected.selectedGateway?.duration}
        cryptoAddr={collected?.walletAddress}
        cryptoIcon={collected.selectedCrypto?.icon}
        paymentMethod={collected.selectedPaymentMethod?.name}
        conversionRate={collected.selectedGateway?.rate}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default ConfirmPaymentView;
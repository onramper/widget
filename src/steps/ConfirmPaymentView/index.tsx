import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyConfirmPayment from './BodyConfirmPayment'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'
import { NextStep } from '../../context';

const ConfirmPaymentView: React.FC<{ nextStep: NextStep }> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  return (
    <div className={styles.view}>
      <Header title="Payment review" backButton />
      <BodyConfirmPayment
        onActionButton={() => nextScreen(<Step nextStep={props.nextStep} needsConfirm={false} />)}
        payAmount={collected.amount.toString()}
        fees={collected.selectedGateway?.fees}
        currency={collected.selectedCurrency?.name}
        cryptoAmount={collected.selectedGateway?.receivedCrypto || 0}
        cryptoDenom={collected.selectedCrypto?.name || ''}
        txTime={collected.selectedGateway?.duration}
        cryptoAddr={collected?.cryptocurrencyAddress}
        cryptoIcon={collected.selectedCrypto?.icon}
        paymentMethod={collected.selectedPaymentMethod?.name}
        conversionRate={collected.selectedGateway?.rate}
        isFilled={true}
      />
      <Footer />
    </div>
  );
};

export default ConfirmPaymentView;
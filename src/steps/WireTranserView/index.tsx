import React, { useCallback, useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWireTransfer from './BodyWireTransfer'
import styles from '../../styles.module.css'

import SuccessView from '../SuccessView'
import { NextStep } from '../../context'

import { copyToClipBoard } from './utils'
import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'


const CreditCardView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  const handleIconClick = useCallback((value: string) => {
    copyToClipBoard(value, () => null)
  }, [])

  return (
    <div className={styles.view}>
      <Header title="Wire transfer details" />
      <BodyWireTransfer
        onActionButton={() => nextScreen(<SuccessView txType='pending' />)}
        amount={collected.amount.toString()}
        bankDetails={nextStep.depositBankAccount}
        symbol={collected.selectedCurrency?.symbol ?? ''}
        textInfo={nextStep.hint ?? ''}
        onIconClick={handleIconClick}
        reference={nextStep.reference ?? 'No reference'}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
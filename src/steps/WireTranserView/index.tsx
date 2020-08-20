import React, { useCallback, useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWireTransfer from './BodyWireTransfer'
import styles from '../../styles.module.css'

import SuccessView from '../SuccessView'

import { copyToClipBoard } from './utils'
import { NavContext } from '../../wrappers/context'


const CreditCardView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);

  const textInfo = 'Go to your online banking and make a manual payment with the following wire transfer details.'

  const wireDetails: { [key: string]: { name: string, value: string } } = {
    'Amount': {
      name: 'Amount',
      value: '100,00',
    },
    'Reference': {
      name: 'Reference',
      value: 'Text',
    },
    'IBAN': {
      name: 'IBAN',
      value: 'NL12 INGB 0123 4567 89',
    },
    'BIC / SWIFT': {
      name: 'BIC / SWIFT',
      value: 'INGBNL2A',
    },
    'Name': {
      name: 'Name',
      value: 'Onramper',
    },
    'wiret-currency': {
      name: '',
      value: '$',
    }
  }

  const handleIconClick = useCallback((name: string) => {
    copyToClipBoard(wireDetails[name].value, () => null)
  }, [wireDetails])

  return (
    <div className={styles.view}>
      <Header title="Wire transfer details" backButton />
      <BodyWireTransfer
        onActionButton={() => nextScreen(<SuccessView />)}
        amount={wireDetails['Amount']}
        reference={wireDetails['Reference']}
        iban={wireDetails['IBAN']}
        bicswift={wireDetails['BIC / SWIFT']}
        name={wireDetails['Name']}
        symbol={wireDetails['wiret-currency']}
        textInfo={textInfo}
        onIconClick={handleIconClick}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
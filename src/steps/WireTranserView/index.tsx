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

  const wireDetails: { [key: string]: string } = {
    'wiret-amount': '100,00',
    'wiret-reference': 'Text',
    'wiret-iban': 'NL12 INGB 0123 4567 89',
    'wiret-bicswift': 'INGBNL2A',
    'wiret-name': 'Onramper',
    'wiret-currency': '$'
  }

  const handleIconClick = useCallback((name: string) => {
    copyToClipBoard(wireDetails[name], () => null)
  }, [wireDetails])

  return (
    <div className={styles.view}>
      <Header title="Wire transfer details" backButton />
      <BodyWireTransfer
        onActionButton={() => nextScreen(<SuccessView />)}
        amount={wireDetails['wiret-amount']}
        reference={wireDetails['wiret-reference']}
        iban={wireDetails['wiret-iban']}
        bicswift={wireDetails['wiret-bicswift']}
        namne={wireDetails['wiret-name']}
        symbol={wireDetails['wiret-currency']}
        textInfo={textInfo}
        onIconClick={handleIconClick}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
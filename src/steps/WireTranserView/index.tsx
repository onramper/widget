import React, { useCallback/* , useContext */ } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyWireTransfer from './BodyWireTransfer'
import styles from '../../styles.module.css'

import { copyToClipBoard } from './utils'
/* import { NavContext } from '../../wrappers/context' */


const CreditCardView: React.FC = () => {
  /* const { nextScreen } = useContext(NavContext); */

  const textInfo = 'Go to your online banking and make a manual payment with the following wire transfer details.'

  const wyreDetails: { [key: string]: string } = {
    'wyret-amount': '100,00',
    'wyret-reference': 'Text',
    'wyret-iban': 'NL91 ABNA 0417 1643 00',
    'wyret-bicswift': 'INGBNL2A',
    'wyret-name': 'Onramper',
    'wyret-currency': '$'
  }

  const handleIconClick = useCallback((name: string) => {
    copyToClipBoard(wyreDetails[name], () => null)
  }, [wyreDetails])

  return (
    <div className={styles.view}>
      <Header title="Wire transfer details" backButton />
      <BodyWireTransfer
        onButtonAction={() => null}
        amount={wyreDetails['wyret-amount']}
        reference={wyreDetails['wyret-reference']}
        iban={wyreDetails['wyret-iban']}
        bicswift={wyreDetails['wyret-bicswift']}
        namne={wyreDetails['wyret-name']}
        symbol={wyreDetails['wyret-currency']}
        textInfo={textInfo}
        onIconClick={handleIconClick}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
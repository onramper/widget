import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyVerifyCode'
import styles from '../../styles.module.css'
import ChooseGatewayView from '../../ChooseGatewayView'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../wrappers/APIContext'

const CreditCardView: React.FC = () => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const { api } = useContext(APIContext);
  const textInfo = 'We sent a verification code to hello@onramper.com. Please enter the verification code below.'
  return (
    <div className={styles.view}>
      <Header title="Card details" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onButtonAction={() => nextScreen(<ChooseGatewayView />)}
        onResendClick={() => backScreen()}
        handleInputChange={api.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default CreditCardView;
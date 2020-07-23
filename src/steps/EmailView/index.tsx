import React, { useContext } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyEmailView'
import styles from '../../styles.module.css'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

import nextStep from '../nextStep'

const EmailView: React.FC = () => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, data } = useContext(APIContext);
  const textInfo = 'We will send a code to your email.'


  const handleButtonAction = () => {
    if (!collected.walletAddress) return
    nextStep(nextScreen, data.nextStep)
  }

  return (
    <div className={styles.view}>
      <Header title="Email" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onButtonAction={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
      />
      <Footer />
    </div>
  );
};

export default EmailView;
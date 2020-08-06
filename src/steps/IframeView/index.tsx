import React, { useContext, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyIframeView'
import styles from '../../styles.module.css'

import SuccessView from '../SuccessView'

import { NextStep } from '../../common/types'

import { NavContext } from '../../wrappers/context'

const IframeView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { replaceScreen } = useContext(NavContext);
  const textInfo = 'Complete your payment. The form below is in a sandbox.'

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== "https://sandbox.onramper.dev/")
        return;
      replaceScreen(<SuccessView />)
    }
    window.removeEventListener("message", receiveMessage);
    window.addEventListener("message", receiveMessage);
  }, [replaceScreen])

  return (
    <div className={styles.view}>
      <Header title="Email" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        src={nextStep.url}
      />
      <Footer />
    </div>
  );
};

export default IframeView;
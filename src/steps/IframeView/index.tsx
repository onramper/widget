import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyIframeView from './BodyIframeView'
import styles from '../../styles.module.css'

import Step from '../Step'

import { NextStep } from '../../context'

import { NavContext } from '../../wrappers/context'

const IframeView: React.FC<{ nextStep: NextStep & { type: 'iframe' | "redirect" } }> = ({ nextStep }) => {
  const { replaceScreen } = useContext(NavContext);
  const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>()

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.origin !== "https://sandbox.onramper.dev")
        return;
      if (event.data.type)
        replaceScreen(<Step nextStep={(event.data as NextStep)} />)
      else if (typeof event.data === 'string')
        setError(event.data)
      else
        setError('Unknow error. Please, contact help@onramper.com')
    }
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [replaceScreen])

  return (
    <div className={styles.view}>
      <Header title="Payment" backButton />
      <BodyIframeView
        textInfo={textInfo}
        error={error}
        src={nextStep.url ?? ''}
        type={nextStep.type}
        onErrorDismissClick={() => setError(undefined)}
      />
      <Footer />
    </div>
  );
};

export default IframeView;
import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import BodyIframeView from './BodyIframeView'
import styles from '../../styles.module.css'

import Step from '../Step'

import { NextStep } from '../../ApiContext'
import { finishCCTransaction } from '@onramper/moonpay-adapter'

import { NavContext } from '../../NavContext'

const baseCreditCardSandboxUrl = `https://sandbox.${
  process.env.STAGE === 'prod' ?
    'onramper.com' : 'onramper.dev'
  }`

const IframeView: React.FC<{ nextStep: NextStep & { type: 'iframe' | "redirect" } }> = ({ nextStep }) => {
  const { replaceScreen } = useContext(NavContext);
  const textInfo = 'Complete your payment. The form below is in a secure sandbox.'
  const [error, setError] = useState<string>()

  useEffect(() => {
    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== baseCreditCardSandboxUrl)
        return;
      if (event.data.type) {
        replaceScreen(<Step nextStep={(event.data as NextStep)} />)
      } else if (event.data.transactionId) {
        const returnedNextStep = await finishCCTransaction(event.data.transactionId, event.data.ccTokenId);
        replaceScreen(<Step nextStep={(returnedNextStep as NextStep)} />)
      } else if (typeof event.data === 'string') {
        setError(event.data)
      } else {
        setError('Unknow error. Please, contact help@onramper.com and provide the following info: ' + nextStep.url)
      }
    }
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, [replaceScreen, nextStep.type, nextStep.url])

  return (
    <div className={styles.view}>
      <Header title="Complete payment" backButton />
      <BodyIframeView
        textInfo={textInfo}
        error={error}
        src={nextStep.url}
        type={nextStep.type}
        onErrorDismissClick={() => setError(undefined)}
      />
    </div>
  );
};

export default IframeView;

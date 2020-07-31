import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyEmailView'
import styles from '../../styles.module.css'
import Step, { nextStepType } from '../Step'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const EmailView: React.FC<{} & { nextStep?: nextStepType }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, /* data, */ apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const textInfo = 'We will send a code to your email.'

  const handleButtonAction = async () => {
    setIsLoading(true)
    let ns: nextStepType | undefined = undefined
    if (nextStep) {
      let params = nextStep.data.reduce((acc, current) => {
        return { ...acc, [current]: collected[current] }
      }, {})
      ns = await apiInterface.executeStep(nextStep.url, params);
      if (ns?.url) {
        nextScreen(<Step {...ns} />)
      }
    }

    setIsLoading(false)

  }

  useEffect(() => {
    const isFilled = collected.email ? true : false
    setIsFilled(isFilled)
  }, [collected.email])

  return (
    <div className={styles.view}>
      <Header title="Email" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
};

export default EmailView;
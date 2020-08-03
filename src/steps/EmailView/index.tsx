import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyEmailView'
import styles from '../../styles.module.css'
import Step, { nextStepType } from '../Step'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const EmailView: React.FC<{ nextStep: nextStepType }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, /* data, */ apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const textInfo = 'We will send a code to your email.'

  const handleButtonAction = async () => {
    setIsLoading(true)
    setErrorMsg(undefined)

    let params = nextStep.data.reduce((acc, current) => {
      return { ...acc, [current.name]: collected[current.name] }
    }, {})
    try {
      const newNextStep = await apiInterface.executeStep(nextStep.url, params);
      nextScreen(<Step {...newNextStep} />)
    } catch (error) {
      setErrorMsg(error.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const isFilled = collected[nextStep.data[0].name] ? true : false
    setIsFilled(isFilled)
    console.log('happens')
  }, [collected, nextStep.data])

  return (
    <div className={styles.view}>
      <Header title="Email" backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
        isLoading={isLoading}
        errorMsg={errorMsg}
        inputName={nextStep.data[0].name}
      />
      <Footer />
    </div>
  );
};

export default EmailView;
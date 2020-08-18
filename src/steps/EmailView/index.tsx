import React, { useContext, useEffect, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyEmailView'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

import { NextStep } from '../../common/types'

const EmailView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, /* data, */ apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const textInfo = 'We will send a code to your email.'

  const nextStepData = nextStep.data || []

  const handleButtonAction = async () => {
    setIsLoading(true)
    setErrorMsg(undefined)

    let params = nextStep.data?.reduce((acc, current) => {
      return { ...acc, [current.name]: collected[current.name] }
    }, {}) || {}
    try {
      const newNextStep = await apiInterface.executeStep(nextStep, params);
      nextScreen(<Step {...newNextStep} />)
    } catch (error) {
      setErrorMsg(error.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const isFilled = collected[nextStepData[0].name] ? true : false
    setIsFilled(isFilled)
  }, [collected, nextStepData])

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
        field={nextStepData[0]}
      />
      <Footer />
    </div>
  );
};

export default EmailView;
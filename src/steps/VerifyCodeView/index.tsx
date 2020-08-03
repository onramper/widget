import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyVerifyCode from './BodyVerifyCode'
import styles from '../../styles.module.css'
import Step, { nextStepType } from '../Step'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const VerifyCodeView: React.FC<{ name: string, codeType: string } & { nextStep: nextStepType }> = ({ name, codeType, nextStep }) => {
  const { nextScreen, backScreen } = useContext(NavContext);
  const { inputInterface, collected, apiInterface } = useContext(APIContext);
  const [isLoading, setIsLoading] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()

  const codeSentTo = collected[codeType]
  const textInfo = `We sent a verification code to ${codeSentTo}. Please enter the verification code below.`

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
  }, [collected, nextStep.data])

  return (
    <div className={styles.view}>
      <Header title={`Verify ${name}`} backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onActionButton={handleButtonAction}
        onResendClick={() => backScreen()}
        handleInputChange={inputInterface.handleInputChange}
        isLoading={isLoading}
        isFilled={isFilled}
        inputName={nextStep.data[0].name}
        errorMsg={errorMsg}
      />
      <Footer />
    </div>
  );
};

export default VerifyCodeView;
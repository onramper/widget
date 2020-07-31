import React, { useContext, useState } from 'react';
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

  const codeSentTo = collected[codeType]
  const textInfo = `We sent a verification code to ${codeSentTo}. Please enter the verification code below.`

  const handleButtonAction = async () => {
    let ns: nextStepType | undefined = undefined
    if (nextStep) {
      let params = nextStep.data.reduce((acc, current) => {
        console.log(current)
        return { ...acc, [current]: collected[current] }
      }, {})
      ns = await apiInterface.executeStep(nextStep.url, params);
      if (ns?.url) {
        nextScreen(<Step {...ns} />)
      }
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.view}>
      <Header title={`Verify ${name}`} backButton />
      <BodyVerifyCode
        textInfo={textInfo}
        onActionButton={handleButtonAction}
        onResendClick={() => backScreen()}
        handleInputChange={inputInterface.handleInputChange}
        isLoading={isLoading}
      />
      <Footer />
    </div>
  );
};

export default VerifyCodeView;
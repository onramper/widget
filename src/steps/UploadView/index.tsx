import React, { useContext, useState } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyUpload from './BodyUpload'
import styles from '../../styles.module.css'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

import { NextStep } from '../../context/api/types/nextStep'
import Step from '../Step'

const UploadView: React.FC<{ nextStep: NextStep }> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const textInfo = `Attach your ${props.nextStep.humanName ?? props.nextStep.data?.[0].name} here so we can verify your identity.`

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const { apiInterface } = useContext(APIContext);

  const handleButtonAction = async (file: File) => {
    setIsLoading(true)
    setErrorMsg(undefined)

    try {
      const newNextStep = await apiInterface.executeStep(props.nextStep, file);
      nextScreen(<Step {...newNextStep} />)
    } catch (error) {
      setErrorMsg(error.message)
    }

    setIsLoading(false)
  }

  return (
    <div className={styles.view}>
      <Header title={`Upload ${props.nextStep.humanName ?? ''}`} backButton />
      <BodyUpload
        onActionButton={handleButtonAction}
        textInfo={textInfo}
        isLoading={isLoading}
        errorMsg={errorMsg}
        acceptedContentTypes={props.nextStep.acceptedContentTypes}
      />
      <Footer />
    </div>
  );
};

export default UploadView;
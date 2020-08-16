import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyForm from './BodyFormView'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NextStep } from '../../common/types'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const FormView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()

  const nextStepData = nextStep.data || []

  const handleButtonAction = async () => {
    setIsLoading(true)
    setErrorMsg(undefined)

    let params = nextStepData.reduce((acc, current) => {
      return { ...acc, [current.name]: collected[current.name] }
    }, {})
    try {
      const newNextStep = await apiInterface.executeStep(nextStep, params);
      nextScreen(<Step {...newNextStep} />)
    } catch (error) {
      setErrorMsg(error.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const someEmpty = nextStepData.some((item) => !collected[item.name])
    setIsFilled(!someEmpty)
  }, [collected, nextStepData])

  return (
    <div className={styles.view}>
      <Header title="Purchase form" backButton />
      <BodyForm
        fields={nextStepData}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isLoading={isLoading}
        errorMsg={errorMsg}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default FormView;
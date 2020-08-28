import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyForm from './BodyFormView'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NextStep, NextStepError, } from '../../context'

import { NavContext } from '../../wrappers/context'
import { APIContext } from '../../context'

const processError = (error: NextStepError, nextStepData: NextStep['data']) => {
  let newErr = new NextStepError('NextStep error')
  if (error.fields) {
    newErr.message = error.fields.filter((err) => !nextStepData?.find(data => data.name === err.field))[0]?.message + '  Go back and fix it.'
    if (!newErr.message)
      newErr.fields = error.fields
  }
  else if (error.field) {
    if (nextStepData?.find(data => (data.name === error.field)))
      newErr = error
    else
      newErr.message = `${error.message} Go back and fix it.`
  }
  else if (error.message)
    newErr.message = error.message

  return newErr
}

const FormView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const [errorObj, setErrorObj] = useState<{ [key: string]: string }>()

  const nextStepData = nextStep.data || []

  const handleButtonAction = async () => {
    setIsLoading(true)
    setErrorObj(undefined)

    let params = nextStepData.reduce((acc, current) => {
      return { ...acc, [current.name]: collected[current.name] }
    }, {})
    try {
      const newNextStep = await apiInterface.executeStep(nextStep, params);
      nextScreen(<Step {...newNextStep} />)
    } catch (error) {
      if (error instanceof NextStepError) {
        const processedError = processError(error, nextStepData)
        if (processedError.field)
          setErrorObj({ [processedError.field]: processedError.message })
        else if (processedError.fields)
          setErrorObj(processedError.fields.reduce((acc, actual) => { return ({ ...acc, [actual.field]: actual.message }) }, {}))
        else
          setErrorMsg(processedError.message)
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const someEmpty = nextStepData.some((item) => (!collected[item.name] && (item.type !== 'boolean' || item.name === 'termsOfUse')))
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
        onErrorDismissClick={() => setErrorMsg(undefined)}
        errorObj={errorObj}
      />
      <Footer />
    </div>
  );
};

export default FormView;
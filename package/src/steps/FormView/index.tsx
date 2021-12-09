import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import BodyForm from './BodyFormView'
import styles from '../../styles.module.css'
import Step from '../Step'
/* import ErrorView from '../../common/ErrorView' */

import { APIContext, NextStep } from '../../ApiContext'
import { NavContext } from '../../NavContext'
import { areAllKeysFilled } from '../utils'

import { processError } from '../Step/utils'
import { useTranslation } from 'react-i18next';


const FormView: React.FC<{ nextStep: NextStep & { type: 'form' } }> = ({ nextStep }) => {
  const { t } = useTranslation();
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>()
  const [errorObj, setErrorObj] = useState<{ [key: string]: string | undefined }>()
  const [title, setTitle] = useState(nextStep.humanName ?? t('formView.defaultTitle'))
  const [infoMsg, setInfoMsg] = useState(nextStep.hint ?? '')

  const { data: nextStepData = [] } = nextStep

  useEffect(() => {
    if (nextStepData.length === 0) return

    // set title
    if (nextStepData.some(field => field.name === 'email') && nextStepData.length <= 2) {
      setTitle(t('formView.emailTitle'))
    }
    else if (nextStepData.some(field => field.name === 'phoneNumber') && nextStepData.length <= 2) {
      setTitle(t('formView.phoneNumberTitle'))
    }
    else if (nextStepData.some(field => field.name === 'verifyEmailCode') && nextStepData.length <= 2) {
      setTitle(t('formView.verifyEmailCodeTitle'))
    }
    else if (nextStepData[0].name === 'verifyPhoneCode' || nextStepData[0].name === 'verifyCreditCard') {
      if (nextStepData.length === 2 && (nextStepData[1].name === 'verifyPhoneCode' || nextStepData[1].name === 'verifyCreditCard'))
        setTitle(t('formView.enterVerificationCodesTitle'))
      else if (nextStepData.length === 1)
        setTitle(t('formView.enterVerificationCodeTitle'))
    }
    /* else if (
      (nextStepData.some(field => field.name === 'state') || nextStepData.length === 1)
      || (
        nextStepData.some(field => field.name === 'firstName')
        && nextStepData.some(field => field.name === 'country')
        && !nextStepData.some(field => field.name === 'ccNumber')
      )
    ) {
      setTitle('Your personal information')
    } */

    // set infoMsg if needed
    if (nextStepData.some(field => field.name === 'bankIban') && nextStepData.length <= 2)
      setInfoMsg(t('formView.bankIbanInfoMsg'))
  }, [nextStepData, t])

  const handleButtonAction = async () => {
    setIsLoading(true)
    setErrorObj(undefined)
    setErrorMsg(undefined)

    const params = nextStepData.reduce((acc, current) => {
      let value = collected[current.name]
      if (current.name==="cryptocurrencyAddress")
        value = collected[current.name]?.address
      if (current.name==="cryptocurrencyAddressTag")
        value = collected["cryptocurrencyAddress"]?.memo
      return { ...acc, [current.name]: value }
    }, {})
    try {
      const payload = {...params, partnerContext:collected.partnerContext}
      const newNextStep = await apiInterface.executeStep(nextStep, payload);
      inputInterface.handleInputChange('isPartnerContextSent', true)
      nextScreen(<Step nextStep={newNextStep} />)
    } catch (error) {
      const processedError = processError(error, nextStepData)
      if (error.fatal) {
        //nextScreen(<ErrorView type="TX" message={error.message} />)
        setErrorObj({ FATAL: error.message })
      }
      else if (processedError.field)
        setErrorObj({ [processedError.field]: processedError.message })
      else if (processedError.fields)
        setErrorObj(processedError.fields.reduce((acc, actual) => { return ({ ...acc, [actual.field]: actual.message }) }, {}))
      else
        setErrorMsg(processedError.message)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    const keysList = nextStepData.filter((data) => {
      if (data.type === 'boolean' && data.name !== 'termsOfUse') return false
      if (data.type!=='boolean' && data.required===false) return false
      return  true
    }).map(nsd => nsd.name)
    const filled = areAllKeysFilled(collected, keysList)
    setIsFilled(filled)
  }, [collected, nextStepData])

  return (
    <div className={styles.view}>
      <Header title={title} backButton />
      <BodyForm
        fields={nextStepData}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isLoading={isLoading}
        errorMsg={errorMsg}
        infoMsg={infoMsg}
        isFilled={isFilled}
        onErrorDismissClick={(field?: string) => {
          if (field && errorObj) setErrorObj(old => ({ ...old, [field]: undefined }))
          else setErrorMsg(undefined)
        }}
        errorObj={errorObj}
      />
    </div>
  );
};

export default FormView;

import React, { useContext, useEffect, useState } from 'react'
import stylesCommon from '../../styles.module.css'

import ErrorVisual from '../../common/ErrorVisual'

import ConfirmPaymentView from '../ConfirmPaymentView'
import UploadView from '../UploadView'
import PickOptionView from '../PickOptionView'
import FormView from '../FormView'
import SuccessView from '../SuccessView'
import IframeView from '../IframeView'
import WireTranserView from '../WireTranserView'

import { NavContext } from '../../wrappers/context'

import { NextStep } from '../../context'

const StepViewContent: React.FC<{ nextStep?: NextStep, needsConfirm?: boolean }> = ({ nextStep, needsConfirm = false }) => {
    const { replaceScreen, backScreen/* , onlyScreen */ } = useContext(NavContext);
    const [isProcessingStep, setIsProcessingStep] = useState(true)

    useEffect(() => {
        if (!nextStep) return
        switch (nextStep.type) {
            case 'form':
                replaceScreen(<FormView nextStep={nextStep} />)
                break;
            case 'file':
                replaceScreen(<UploadView nextStep={nextStep} />)
                break;
            case 'pickOne':
                replaceScreen(<PickOptionView nextStep={nextStep} />)
                break;
            case 'redirect':
                replaceScreen(<IframeView nextStep={nextStep} />)
                break;
            case 'completed':
                replaceScreen(<SuccessView txType='instant' />)//onlyScreen(<SuccessView txType='instant' />)
                break;
            case 'iframe':
                if (needsConfirm)
                    replaceScreen(<ConfirmPaymentView nextStep={nextStep} />)
                else
                    replaceScreen(<IframeView nextStep={nextStep} />)
                break;
            case 'requestBankTransaction':
                if (needsConfirm)
                    replaceScreen(<ConfirmPaymentView nextStep={nextStep} />)
                else
                    replaceScreen(<WireTranserView nextStep={nextStep} />)//onlyScreen(<WireTranserView nextStep={nextStep} />)
                break;
            default:
                break;
        }
        setIsProcessingStep(false)
    }, [nextStep, replaceScreen, backScreen, needsConfirm])

    return (
        <main className={stylesCommon.body}>
            {isProcessingStep && <div className={`${stylesCommon['body__child']} ${stylesCommon['grow']}`}>
                <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
            </div>}
        </main>
    )
}

export default StepViewContent
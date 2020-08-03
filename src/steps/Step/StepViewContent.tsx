import React, { useContext, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

/* import UploadView from '../UploadView'
import CreditCardView from '../CreditCardView'
import WireTranserView from '../WireTranserView' */
import VerifyCodeView from '../VerifyCodeView'
import EmailView from '../EmailView'
import FormView from '../FormView'

import { NavContext } from '../../wrappers/context'

export type _nextStepType = {
    type: string
    url: string,
    data: { name: string, type: string }[]
}

const StepViewContent: React.FC<_nextStepType> = (nextStep) => {
    const { replaceScreen, backScreen } = useContext(NavContext);

    useEffect(() => {
        switch (nextStep.type) {
            case ('form'):
                if (nextStep.data.length === 1) {
                    if (nextStep.data[0].name === 'email')
                        replaceScreen(<EmailView nextStep={nextStep} />)
                    else if (nextStep.data[0].name === 'verifyEmailCode')
                        replaceScreen(<VerifyCodeView nextStep={nextStep} codeType='email' name='email' />)
                }
                else
                    replaceScreen(<FormView nextStep={nextStep} />)
                break;
            /* case ('form'):
                replaceScreen(<VerifyCodeView nextStep={nextStep} codeType='email' name='email' />)
            case ('form'):
                replaceScreen(<UploadView />)
            case ('form'):
                replaceScreen(<CreditCardView />)
            case ('form'):
                replaceScreen(<WireTranserView />) */
            default:
            /* replaceScreen(<FormView fields={nextStep.data[0].name} />) */
        }
    }, [nextStep, replaceScreen, backScreen])

    return (
        <main className={stylesCommon.body}>
            <span>
                Oops... that shouldn't happen, please contact us.
            </span>
        </main>
    )
}

export default StepViewContent
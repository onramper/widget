import React, { useContext, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

import UploadView from '../UploadView'
import CreditCardView from '../CreditCardView'
import WireTranserView from '../WireTranserView'
import EmailView from '../EmailView'
import FormView from '../FormView'
import VerifyCodeView from '../VerifyCodeView'

import { NavContext } from '../../wrappers/context'

export type _nextStepType = {
    url: string,
    data: string[]
}

const StepViewContent: React.FC<_nextStepType> = (nextStep) => {
    const { replaceScreen, backScreen } = useContext(NavContext);

    useEffect(() => {
        let urlType = nextStep.url.split('/')[5]
        console.log('urlType', urlType, urlType === 'verifyEmail')
        if (urlType === 'email')
            replaceScreen(<EmailView nextStep={nextStep} />)
        else if (urlType === 'verifyEmail')
            replaceScreen(<VerifyCodeView nextStep={nextStep} codeType='email' name='email' />)
        else if (urlType === 'document')
            replaceScreen(<UploadView />)
        else if (urlType === 'creditCard')
            replaceScreen(<CreditCardView />)
        else if (urlType === 'wyreTransfer')
            replaceScreen(<WireTranserView />)
        else
            replaceScreen(<FormView fields={nextStep.data} />)
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
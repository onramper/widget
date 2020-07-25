import React from 'react';

import EmailView from './EmailView'
import VerifyCodeView from './VerifyCodeView'

const nextStep = (nextScreen: any, step: { url?: string, data?: string[] }) => {

    if (!step.url) return

    const splittedURL = step.url.split('/')
    const type = splittedURL[5]
    switch (type) {
        case 'email':
            nextScreen(<EmailView />)
            break
        case 'verifyEmail':
            nextScreen(<VerifyCodeView name='email' codeType='email' />)
            break
        default:
            break
    }
    return null
}


export default nextStep
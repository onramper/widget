import React from 'react'
import { ReactComponent as ErrorIllustration } from '../../icons/error.svg'

interface ErrorType {
    title: string;
    description: JSX.Element;
    illustration: SvgrComponent;
    tryAgain: boolean;
    faqsLink: boolean;
}

const TX_ERROR: ErrorType = {
    title: "Something went wrong",
    description: <>Your cryptos were on the way but… an error has occurred.
    It&apos;s posible that your bank rejected the transaction.<br /><br />
    Please, try with another credit card or try another gateway.
    For more information about why transactions are rejected
    read our FAQs or contact us.</>,
    illustration: ErrorIllustration,
    tryAgain: true,
    faqsLink: true
}

const GATEWAYS_ERROR: ErrorType = {
    title: "Unexplored area",
    description: <>Your country is not yet supported by Onramper.<br/>
    We&apos;re working hard to make it available for you as soon as possible!
    For more information read our FAQs or contact us.</>,
    illustration: ErrorIllustration,
    tryAgain: false,
    faqsLink: true
}

export { TX_ERROR, GATEWAYS_ERROR }
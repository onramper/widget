import React from 'react'
import { ReactComponent as ErrorIllustration } from '../../icons/error.svg'

const TX_ERROR = {
        title: "Something went wrong",
        description: <>Your cryptos were on the way but… an error has occurred.
        It's posible that your bank rejected the transaction.<br /><br />
        Please, try with another credit card or try another gateway.
        For more information about why transactions are rejected
        read our FAQs or contact us.</>,
        illustration: ErrorIllustration
    }

export { TX_ERROR }
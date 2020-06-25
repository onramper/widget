import React, { useCallback } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import InfoBox from '../../common/InfoBox'

import IconCopy from '../../icons/copyicon.svg'

import { copyToClipBoard } from './utils'

type BodyWireTransferType = {
    onButtonAction?: () => void,
    amount: string
    reference: string
    iban: string
    bicswift: string
    namne: string
    symbol: string
    textInfo?: string
}

const BodyWireTransfer: React.FC<BodyWireTransferType> = (props) => {
    const { amount, reference, iban, bicswift, namne, symbol, textInfo } = props
    const { onButtonAction } = props

    const copycb = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        copyToClipBoard(e.currentTarget.getAttribute('data-value')!, () => null)
    }, [])

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText symbol={symbol} value={amount} name='wyret-amount' className={stylesCommon['row-fields__child']} label="Amount" disabled icon={IconCopy} iconPosition='end' onIconClick={copycb} />
                <InputText value={reference} name='wyret-reference' className={stylesCommon['row-fields__child']} label="Reference" disabled icon={IconCopy} iconPosition='end' onIconClick={copycb} />
            </div>
            <InputText value={iban} name='wyret-number' className={stylesCommon['body__child']} label="IBAN" disabled icon={IconCopy} iconPosition='end' onIconClick={copycb} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText value={bicswift} name='wyret-amount' className={stylesCommon['row-fields__child']} label="BIC / SWIFT" disabled icon={IconCopy} iconPosition='end' onIconClick={copycb} />
                <InputText value={namne} name='wyret-reference' className={stylesCommon['row-fields__child']} label="Name" disabled icon={IconCopy} iconPosition='end' onIconClick={copycb} />
            </div>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyWireTransfer.defaultProps = {
    onButtonAction: () => null
}

export default BodyWireTransfer
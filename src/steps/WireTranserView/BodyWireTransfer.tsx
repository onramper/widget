import React from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import InfoBox from '../../common/InfoBox'

import IconCopy from '../../icons/copyicon.svg'

type BodyWireTransferType = {
    onButtonAction?: () => void,
    onIconClick?: (id: string) => void,
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
    const { onButtonAction, onIconClick } = props

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText error='d' symbol={symbol} value={amount} name='wyret-amount' className={stylesCommon['row-fields__child']} label="Amount" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
                <InputText value={reference} name='wyret-reference' className={stylesCommon['row-fields__child']} label="Reference" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
            </div>
            <InputText value={iban} name='wyret-iban' className={stylesCommon['body__child']} label="IBAN" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText value={bicswift} name='wyret-bicswift' className={stylesCommon['row-fields__child']} label="BIC / SWIFT" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
                <InputText value={namne} name='wyret-name' className={stylesCommon['row-fields__child']} label="Name" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
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
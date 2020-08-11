import React, { useState } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import IconCopy from '../../icons/copyicon.svg'

type BodyWireTransferType = {
    onActionButton?: () => void,
    onIconClick?: (id: string) => void,
    amount: { name: string, value: string }
    reference: { name: string, value: string }
    iban: { name: string, value: string }
    bicswift: { name: string, value: string }
    name: { name: string, value: string }
    symbol: { name: string, value: string }
    textInfo?: string
}

const BodyWireTransfer: React.FC<BodyWireTransferType> = (props) => {
    const { amount, reference, iban, bicswift, name, symbol, textInfo } = props
    const { onActionButton, onIconClick } = props

    const [copiedText, setCopiedText] = useState<string>()

    const onClick = (id: string) => {
        console.log(id)
        if (onIconClick) {
            onIconClick(id)
            setCopiedText(`${id} copied to clipboard.`)
        }
    }

    return (
        <main className={stylesCommon.body}>
            <InfoBox className={`${stylesCommon['body__child']}`} in={textInfo !== undefined} >
                {textInfo}
            </InfoBox>
            <InfoBox type='notification' className={`${stylesCommon['body__child']}`} in={copiedText !== undefined} canBeDismissed onDismissClick={() => setCopiedText(undefined)}>
                {copiedText}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText symbol={symbol.value} symbolPosition={'start'} value={amount.value} name={amount.name} className={stylesCommon['row-fields__child']} label="Amount" disabled icon={IconCopy} iconPosition='end' onIconClick={onClick} />
                <InputText value={reference.value} name={reference.name} className={stylesCommon['row-fields__child']} label="Reference" disabled icon={IconCopy} iconPosition='end' onIconClick={onClick} />
            </div>
            <InputText value={iban.value} name={iban.name} className={stylesCommon['body__child']} label="IBAN" disabled icon={IconCopy} iconPosition='end' onIconClick={onClick} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText value={bicswift.value} name={bicswift.name} className={stylesCommon['row-fields__child']} label="BIC / SWIFT" disabled icon={IconCopy} iconPosition='end' onIconClick={onClick} />
                <InputText value={name.value} name={name.name} className={stylesCommon['row-fields__child']} label="Name" disabled icon={IconCopy} iconPosition='end' onIconClick={onClick} />
            </div>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text='Continue' />
            </div>
        </main>
    )
}

BodyWireTransfer.defaultProps = {
    onActionButton: () => null
}

export default BodyWireTransfer
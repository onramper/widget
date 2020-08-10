import React from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import IconCopy from '../../icons/copyicon.svg'

type BodyWireTransferType = {
    onActionButton?: () => void,
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
    const { onActionButton, onIconClick } = props

    return (
        <main className={stylesCommon.body}>
            <InfoBox className={`${stylesCommon['body__child']}`} in={textInfo !== undefined} >
                {textInfo}
            </InfoBox>
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText symbol={symbol} symbolPosition={'start'} value={amount} name='wiret-amount' className={stylesCommon['row-fields__child']} label="Amount" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
                <InputText value={reference} name='wiret-reference' className={stylesCommon['row-fields__child']} label="Reference" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
            </div>
            <InputText value={iban} name='wiret-iban' className={stylesCommon['body__child']} label="IBAN" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText value={bicswift} name='wiret-bicswift' className={stylesCommon['row-fields__child']} label="BIC / SWIFT" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
                <InputText value={namne} name='wiret-name' className={stylesCommon['row-fields__child']} label="Name" disabled icon={IconCopy} iconPosition='end' onIconClick={onIconClick} />
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
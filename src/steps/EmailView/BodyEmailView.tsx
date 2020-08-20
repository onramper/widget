import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'
import { APIContext } from '../../context'

type BodyEmailViewType = {
    onActionButton: () => void;
    handleInputChange: (name: string, value: any) => void
    textInfo?: string
    isFilled?: boolean
    isLoading?: boolean
    errorMsg?: string
    field: {
        name: string
        type: string
        humanName: string
    }
}

const BodyEmailView: React.FC<BodyEmailViewType> = (props) => {
    const { collected } = useContext(APIContext);
    const { handleInputChange, onActionButton } = props
    const { textInfo, isFilled = false, isLoading = false } = props

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <InputText value={collected[props.field.name] ?? ''} type={props.field.type} name={props.field.name} onChange={handleInputChange} className={stylesCommon['body__child']} label={props.field.humanName} placeholder="hello@onramper.com" error={props.errorMsg} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Send'} disabled={!isFilled || isLoading} />
            </div>
        </main>
    )
}

export default BodyEmailView
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
    inputName?: string
}

const BodyEmailView: React.FC<BodyEmailViewType> = (props) => {
    const { collected } = useContext(APIContext);
    const { handleInputChange, onActionButton } = props
    const { textInfo, isFilled = false, isLoading = false, inputName = 'email' } = props

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={textInfo !== undefined} className={`${stylesCommon['body__child']}`}>
                {textInfo}
            </InfoBox>
            <InputText value={collected[inputName]} type='email' name={inputName} onChange={handleInputChange} className={stylesCommon['body__child']} label="Email" placeholder="hello@onramper.com" error={props.errorMsg} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Send'} disabled={!isFilled || isLoading} />
            </div>
        </main>
    )
}

export default BodyEmailView
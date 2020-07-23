import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import InfoBox from '../../common/InfoBox'
import { APIContext } from '../../context'

type BodyEmailViewType = {
    onButtonAction: () => void;
    handleInputChange: (name: string, value: any) => void
    textInfo?: string
}

const BodyEmailView: React.FC<BodyEmailViewType> = (props) => {
    const { collected } = useContext(APIContext);
    const { handleInputChange, onButtonAction } = props
    const { textInfo } = props

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <InputText value={collected.email} type='email' name='email' onChange={handleInputChange} className={stylesCommon['body__child']} label="Email" placeholder="hello@onramper.com" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
            <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyEmailView.defaultProps = {

}

export default BodyEmailView
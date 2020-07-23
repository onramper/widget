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
    isFilled: boolean
}

const BodyEmailView: React.FC<BodyEmailViewType> = (props) => {
    const { collected } = useContext(APIContext);
    const { handleInputChange, onActionButton } = props
    const { textInfo, isFilled } = props

    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <InputText value={collected.email} type='email' name='email' onChange={handleInputChange} className={stylesCommon['body__child']} label="Email" placeholder="hello@onramper.com" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text='Send' disabled={!isFilled} />
            </div>
        </main>
    )
}

BodyEmailView.defaultProps = {

}

export default BodyEmailView
import React from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InputText from '../../common/Input/InputText'
import InfoBox from '../../common/InfoBox'

type BodyVerifyCodeType = {
    onButtonAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onResendClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
    handleInputChange: (name: string, value: any) => void
    textInfo?: string
}

const BodyVerifyCode: React.FC<BodyVerifyCodeType> = (props) => {
    const { handleInputChange, onButtonAction, onResendClick } = props
    const { textInfo } = props
    return (
        <main className={stylesCommon.body}>
            {textInfo ?
                <div className={`${stylesCommon['body__child']}`}>
                    <InfoBox text={textInfo!} />
                </div> : null}
            <InputText name='card-number' onChange={handleInputChange} className={stylesCommon['body__child']} label="Verification code" placeholder="" />
            <span onClick={onResendClick} className={styles['resend']}>Resend code&nbsp;</span>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyVerifyCode.defaultProps = {

}

export default BodyVerifyCode
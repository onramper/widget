import React from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

type BodyVerifyCodeType = {
    onActionButton: () => void;
    onResendClick: () => void;
    handleInputChange: (name: string, value: any) => void
    textInfo?: string
    isLoading?: boolean
    isFilled?: boolean
    inputName?: string
    errorMsg?: string
}

const BodyVerifyCode: React.FC<BodyVerifyCodeType> = (props) => {
    const { handleInputChange, onActionButton, onResendClick } = props
    const { textInfo, isLoading = false, inputName = 'verifyEmailCode', isFilled = 'false' } = props
    return (
        <main className={stylesCommon.body}>
            <div className={`${stylesCommon['body__child']}`}>
                <InfoBox in={textInfo !== undefined} >
                    {textInfo}
                </InfoBox>
            </div>
            <InputText name={inputName} onChange={handleInputChange} className={stylesCommon['body__child']} label="Verification code" placeholder="" error={props.errorMsg} />
            <span onClick={onResendClick} className={styles['resend']}>Resend code&nbsp;</span>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Verifying code...' : 'Continue'} disabled={!isFilled || isLoading} />
            </div>
        </main>
    )
}

BodyVerifyCode.defaultProps = {

}

export default BodyVerifyCode
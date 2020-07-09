import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'

import { APIContext } from '../../wrappers/APIContext'

type BodyPersonalDetailsType = {
    onButtonAction: () => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const BodyPersonalDetails: React.FC<BodyPersonalDetailsType> = (props) => {
    const { handleInputChange, onButtonAction } = props

    const { collected } = useContext(APIContext);

    return (
        <main className={stylesCommon.body}>
            <InputText name='personal-fname' value={collected['personal-fname']} onChange={handleInputChange} className={stylesCommon['body__child']} label="First name" placeholder="" />
            <InputText name='personal-lname' value={collected['personal-lname']} onChange={handleInputChange} className={stylesCommon['body__child']} label="Last name" placeholder="" />
            <InputText value={collected['personal-birth']} type='date' name='personal-birth' onChange={handleInputChange} className={stylesCommon['body__child']} label="Date of birth" placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyPersonalDetails.defaultProps = {

}

export default BodyPersonalDetails
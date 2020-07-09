import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'

import { APIContext } from '../../wrappers/APIContext'

type BodyAddressViewType = {
    onButtonAction: () => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const BodyAddressView: React.FC<BodyAddressViewType> = (props) => {
    const { handleInputChange, onButtonAction } = props

    const { collected } = useContext(APIContext);

    return (
        <main className={stylesCommon.body}>
            <InputText name='personal-address' value={collected['personal-address']} onChange={handleInputChange} className={stylesCommon['body__child']} label="Address" placeholder="" />
            <InputText name='personal-address2' value={collected['personal-address2']} onChange={handleInputChange} className={stylesCommon['body__child']} label="Address 2 (Optional)" placeholder="" />
            <InputText name='personal-city' value={collected['personal-city']} onChange={handleInputChange} className={stylesCommon['body__child']} label="City" placeholder="" />
            <InputText name='personal-postalcode' value={collected['personal-postalcode']} onChange={handleInputChange} className={stylesCommon['body__child']} label="Postal / Zip code" placeholder="" />
            <InputText name='personal-country' value={collected['personal-country']} onChange={handleInputChange} className={stylesCommon['body__child']} label="Country" placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyAddressView.defaultProps = {

}

export default BodyAddressView
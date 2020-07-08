import React from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'

type BodyAddressViewType = {
    onButtonAction: () => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const BodyAddressView: React.FC<BodyAddressViewType> = (props) => {
    const { handleInputChange, onButtonAction } = props
    return (
        <main className={stylesCommon.body}>
            <InputText name='personal-address' onChange={handleInputChange} className={stylesCommon['body__child']} label="Address" placeholder="" />
            <InputText name='personal-address2' onChange={handleInputChange} className={stylesCommon['body__child']} label="Address 2 (Optional)" placeholder="" />
            <InputText name='personal-city' onChange={handleInputChange} className={stylesCommon['body__child']} label="City" placeholder="" />
            <InputText name='personal-postalcode' onChange={handleInputChange} className={stylesCommon['body__child']} label="Postal / Zip code" placeholder="" />
            <InputText name='personal-country' onChange={handleInputChange} className={stylesCommon['body__child']} label="Country" placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyAddressView.defaultProps = {
 
}

export default BodyAddressView
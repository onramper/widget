import React from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'

type BodyCreditCardType = {
    onButtonAction: () => void
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

const BodyCreditCard: React.FC<BodyCreditCardType> = (props) => {
    const { handleInputChange, onButtonAction } = props
    return (
        <main className={stylesCommon.body}>
            <InputText name='card-number' onChange={handleInputChange} className={stylesCommon['body__child']} label="Card number" placeholder="" />
            <InputText name='card-name' onChange={handleInputChange} className={stylesCommon['body__child']} label="Card holder name" placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                <InputText name='card-date' onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="Expiry date" placeholder="MM-YY" />
                <InputText name='card-ccv' onChange={handleInputChange} className={stylesCommon['row-fields__child']} label="CCV" placeholder="123" />
            </div>
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyCreditCard.defaultProps = {
 
}

export default BodyCreditCard
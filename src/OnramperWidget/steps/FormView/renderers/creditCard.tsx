import React from 'react'
import stylesCommon from '../../../styles.module.css'
import InputText from '../../../common/Input/InputText'

type CreditCardInputType = {
    handleInputChange: (name: string, value: any) => void
    errorObj?: { [key: string]: string }
}

const CreditCardInput: React.FC<CreditCardInputType> = (props) => {

    const onChange = (name: string, value: string) => {
        if (name === 'ccExpiration') {
            const month = value.split('/')[0]
            const year = value.split('/')[1]
            props.handleInputChange('ccMonth', month)
            props.handleInputChange('ccYear', year)
        }
        else {
            props.handleInputChange(name, value)
        }
    }

    return (
        <>
            <InputText
                className={stylesCommon["body__child"]}
                label="Card number"
                name="ccNumber"
                error={props.errorObj?.['ccNumber']}
                onChange={onChange}
                placeholder='411111111111'
            />
            <div
                className={`${stylesCommon["body__child"]} ${stylesCommon["row-fields"]}`}
            >
                <InputText
                    className={stylesCommon["row-fields__child"]}
                    label="Expiry date"
                    name="ccExpiration"
                    error={props.errorObj?.['ccMonth'] || props.errorObj?.['ccYear']}
                    onChange={onChange}
                    placeholder='MM/YYY'
                />
                <InputText
                    className={stylesCommon["row-fields__child"]}
                    label="CCV"
                    name="ccCVV"
                    error={props.errorObj?.['ccCVV']}
                    onChange={onChange}
                    placeholder='123'
                />
            </div>
        </>
    )
}

export default CreditCardInput
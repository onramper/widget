import React, { useContext, useState, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InputText from '../../common/Input/InputText'
import InputCryptoAddr from '../../common/Input/InputCryptoAddr'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import { APIContext, NextStep } from '../../context'

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: NonNullable<NextStep['data'][]>[0]
    isFilled?: boolean
    isLoading?: boolean
    errorObj?: { [key: string]: string }
    errorMsg?: string
    inputName?: string
    onErrorDismissClick: () => void
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { handleInputChange, onActionButton, fields = [] } = props
    const { collected, inputInterface } = useContext(APIContext);
    const { isFilled = false, isLoading = false, errorObj, errorMsg } = props

    const [push2Bottom, setPush2Bottom] = useState(false)

    useEffect(() => {
        console.log(stylesCommon['push-bottom'])
        console.log(fields.some(field => field.name === 'termsOfUse'))
        setPush2Bottom(fields.some(field => field.name === 'termsOfUse'))
    }, [fields])

    const onChange = (name: string, value: any, type?: string) => {
        let v = value
        if (type === 'date') {
            v = {
                year: Number(value.split('-')[0]),
                month: Number(value.split('-')[1]),
                day: Number(value.split('-')[2])
            }
        }
        handleInputChange(name, v)
    }

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={errorMsg !== undefined} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} className={`${stylesCommon['body__child']}`} >
                {errorMsg}
            </InfoBox>
            {
                fields.map((field, i) =>
                    <div key={i} className={`${stylesCommon['body__child']} ${push2Bottom === true && field.name === 'termsOfUse' ? stylesCommon['push-bottom'] : ''}`}>
                        {
                            (field.name === 'cryptocurrencyAddress' && <InputCryptoAddr className={stylesCommon['body__child']} handleInputChange={handleInputChange} />)
                            || (field.type === 'boolean' && field.name === 'termsOfUse'
                                && <label className={`${styles['terms']}`}>
                                    <input type="checkbox" name={field.name} onChange={(e) => inputInterface.handleInputChange(e.currentTarget.name, e.currentTarget.checked)} /> I accept {
                                        field.terms?.map<React.ReactNode>(term => <a href={term.url} target='_blank'>{term.humanName}</a>)
                                            .reduce((acc, actual, i, arr) => [acc, i === arr.length - 1 ? ' and ' : ', ', actual])
                                    }.
                                </label>)
                            || <InputText error={errorObj?.field === field.name ? errorObj.message : undefined} name={field.name} value={collected[field.name] ?? ''} onChange={onChange} className={stylesCommon['body__child']} label={field.humanName} type={field.type} />
                        }
                    </div>
                )
            }
            <div className={`${stylesCommon['body__child']} ${push2Bottom ? '' : stylesCommon['grow']}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Continue'} disabled={!isFilled || isLoading} />
            </div>
        </main >
    )
}

BodyFormView.defaultProps = {

}

export default BodyFormView
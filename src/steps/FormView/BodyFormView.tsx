import React, { useContext, useState, useEffect, useCallback } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import InputText from '../../common/Input/InputText'
import InputCryptoAddr from '../../common/Input/InputCryptoAddr'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import { APIContext, StepDataItems } from '../../ApiContext'
import { NavContext } from '../../NavContext'

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: StepDataItems
    isFilled?: boolean
    isLoading?: boolean
    errorObj?: { [key: string]: string }
    errorMsg?: string
    inputName?: string
    onErrorDismissClick: () => void
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { handleInputChange, onActionButton, fields = [] } = props
    const { collected } = useContext(APIContext);
    const { backScreen } = useContext(NavContext)
    const { isFilled = false, isLoading = false, errorObj, errorMsg } = props

    const [push2Bottom, setPush2Bottom] = useState(false)

    useEffect(() => {
        setPush2Bottom(fields.some(field => field.name === 'termsOfUse'))
    }, [fields])

    const onChange = useCallback((name: string, value: any, type?: string) => {
        let v = value
        if (v && type === 'date') {
            v = {
                year: Number("0000" + value.split('-')[0].slice(-4)),
                month: Number("00" + value.split('-')[1].slice(-2)),
                day: Number("00" + value.split('-')[2].slice(-2))
            }
        }
        handleInputChange(name, v)
    }, [handleInputChange])

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={!!errorMsg} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} className={`${stylesCommon['body__child']}`} >
                {errorMsg}
            </InfoBox>
            {
                fields.map((field, i) =>
                    (field.name === 'cryptocurrencyAddress' && (
                        <InputCryptoAddr type={field.type} key={i} className={stylesCommon['body__child']} handleInputChange={onChange} error={errorObj?.[field.name]} />
                    ))
                    || ((field.name === 'verifyPhoneCode' || field.name === 'verifyEmailCode') && (
                        <>
                            <InputText name={field.name} onChange={onChange} label={field.humanName} placeholder="" error={errorObj?.[field.name]} className={stylesCommon['body__child']} type={field.type === 'integer' ? 'number' : field.type} />
                            <span onClick={() => backScreen()} className={styles['resend']}>Resend code&nbsp;</span>
                        </>
                    ))
                    || (field.type === 'boolean' && field.name === 'termsOfUse' && (
                        <label key={i} className={`${stylesCommon['body__child']} ${stylesCommon['push-bottom']} ${styles['terms']}`}>
                            <input type="checkbox" checked={collected[field.name]} name={field.name} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.checked, e.currentTarget.type)} />&nbsp;I accept {
                                field.terms?.map<React.ReactNode>(term => <a href={term.url} target='_blank' rel="noopener noreferrer">{term.humanName}</a>)
                                    .reduce((acc, actual, i, arr) => [acc, i === arr.length - 1 ? ' and ' : ', ', actual])
                            }.</label>
                    ))
                    || ((field.type !== 'boolean') && (
                        <InputText error={errorObj?.[field.name]} name={field.name} value={collected[field.name] ?? ''} onChange={onChange} className={stylesCommon['body__child']} label={field.humanName} type={field.type === 'integer' ? 'number' : field.type} />
                    ))
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
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import CreditCardInput from './renderers/creditCard'
import InputText from '../../common/Input/InputText'
import InputCryptoAddr from '../../common/Input/InputCryptoAddr'
import ButtonAction from '../../common/ButtonAction'
import InputButton from '../../common/Input/InputButton'
import InfoBox from '../../common/InfoBox'
import PickView from '../../PickView'

import { APIContext, StepDataItems } from '../../ApiContext'
import { NavContext } from '../../NavContext'
import icons from 'rendered-country-flags'

import countryNames from './utils/contryNames'
import phoneCodes from './utils/phoneCodes'
import usStates from './utils/usStates'

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
    const { backScreen, nextScreen } = useContext(NavContext)
    const { isFilled = false, isLoading = false, errorObj, errorMsg } = props

    const [push2Bottom, setPush2Bottom] = useState(false)

    const firstRender = useRef(true)
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            handleInputChange("phoneCountryCode", +phoneCodes[collected['selectedCountry']?.toUpperCase() ?? 'GB']?.phoneCode)
            handleInputChange("state", collected['state'] ?? '0')
            return
        }
    }, [handleInputChange, collected])

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

    const isRequired = (fields2Check: string[], isReq: boolean, isReqCB: () => void) => {
        for (const index in fields2Check) {
            if (!fields.some((f) => f.name === fields2Check[index])) {
                return false
            }
        }
        if (!isReq)
            isReqCB()

        return true
    }

    useEffect(() => {
        if (!collected['country'])
            onChange('country', collected['selectedCountry'])
    }, [onChange, collected])

    let isCreditCardAdded = false,
        isPhoneNumberAdded = false

    return (
        <main className={stylesCommon.body}>
            <InfoBox in={!!errorMsg} type='error' canBeDismissed onDismissClick={props.onErrorDismissClick} className={`${stylesCommon['body__child']}`} >
                {errorMsg}
            </InfoBox>
            {
                fields.map((field, i) => {
                    const ccCheck = isCreditCardAdded
                    const phoneNumberCheck = isPhoneNumberAdded
                    return (
                        (field.name === 'cryptocurrencyAddress' && (
                            <InputCryptoAddr hint={field.hint} type={getInputType(field)} key={i} className={stylesCommon['body__child']} handleInputChange={onChange} error={errorObj?.[field.name]} />
                        ))
                        || ((field.name === 'verifyPhoneCode' || field.name === 'verifyEmailCode' || field.name === 'verifyCreditCard') && (
                            <React.Fragment key={i}>
                                <InputText hint={field.hint} name={field.name} onChange={onChange} label={field.humanName} placeholder="" error={errorObj?.[field.name]} className={stylesCommon['body__child']} type={getInputType(field)} />
                                <span key={999} onClick={() => backScreen()} className={styles['resend']}>Resend code&nbsp;</span>
                            </React.Fragment>
                        ))
                        || ((field.type === 'boolean' && field.name === 'termsOfUse') && (
                            <label key={i} className={`${stylesCommon['body__child']} ${styles['terms']}`}>
                                <input type="checkbox" checked={collected[field.name] ?? false} name={field.name} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.checked, e.currentTarget.type)} />&nbsp;I accept {
                                    field.terms?.map<React.ReactNode>((term, i) => <a key={i} href={term.url} target='_blank' rel="noopener noreferrer">{term.humanName}</a>)
                                        .reduce((acc, actual, i, arr) => [acc, i === arr.length - 1 ? ' and ' : ', ', actual])
                                }.</label>
                        ))
                        || ((field.name === 'country') && (
                            <InputButton key={i} className={stylesCommon['body__child']} onClick={
                                () => nextScreen(
                                    <PickView
                                        title={field.humanName}
                                        name={field.name}
                                        onItemClick={(name, index, item) => {
                                            onChange(name, item.id.toLowerCase())
                                            backScreen()
                                        }}
                                        items={Object.entries(countryNames).map(([code, name]) => ({
                                            id: code,
                                            name,
                                            icon: icons[code],
                                            info: code
                                        }))}
                                        searchable
                                    />
                                )}
                                label={field.humanName} selectedOption={countryNames[(collected[field.name] ?? 'gb').toUpperCase()]} icon={icons[(collected[field.name] ?? 'gb').toUpperCase()]} />
                        )) || ((field.name === 'state') && (
                            collected['country'] === 'us' ?
                                <InputButton key={i} className={stylesCommon['body__child']} onClick={
                                    () => nextScreen(
                                        <PickView
                                            title={field.humanName}
                                            name={field.name}
                                            onItemClick={(name, index, item) => {
                                                onChange(name, item.id.toLowerCase())
                                                backScreen()
                                            }}
                                            items={Object.entries(usStates).map(([code, state]) => ({
                                                id: code,
                                                name: state.name,
                                                info: code
                                            }))}
                                            searchable
                                        />
                                    )}
                                    label={field.humanName}
                                    selectedOption={usStates[(collected[field.name] ?? 'al').toUpperCase()].name}
                                />
                                : <></>
                        )) || (((field.name === 'ccNumber' || field.name === 'ccMonth' || field.name === 'ccYear' || field.name === 'ccCVV') && isRequired(['ccNumber', 'ccMonth', 'ccYear', 'ccCVV'], isCreditCardAdded, () => isCreditCardAdded = true)) && (
                            !ccCheck ?
                                <CreditCardInput key={i} handleInputChange={onChange} errorObj={errorObj} />
                                : <></>
                        )) || (((field.name === 'phoneCountryCode' || field.name === 'phoneNumber') && isRequired(['phoneCountryCode', 'phoneNumber'], isPhoneNumberAdded, () => isPhoneNumberAdded = true)) && (
                            !phoneNumberCheck ?
                                <div className={`${stylesCommon['body__child']} ${stylesCommon['row-fields']}`}>
                                    <InputButton onClick={
                                        () => nextScreen(
                                            <PickView
                                                title={field.humanName}
                                                name={field.name}
                                                onItemClick={(name, index, item) => {
                                                    onChange(name, +item.name)
                                                    onChange('country', item.id.toLowerCase())
                                                    backScreen()
                                                }}
                                                items={Object.entries(phoneCodes).map(([code, infoObj]) => ({
                                                    id: code,
                                                    name: infoObj['phoneCode'],
                                                    info: infoObj['name'],
                                                    searchWords: infoObj['searchWords']
                                                }))}
                                                searchable
                                            />
                                        )}
                                        className={stylesCommon['row-fields__child']} label="Phone country code"
                                        selectedOption={'+' + collected[field.name] ?? phoneCodes[(collected['country'] ?? 'gb').toUpperCase()].phoneCode}
                                        error={errorObj?.[field.name]}
                                    />
                                    <InputText name='phoneNumber' type='number' value={collected['phoneNumber'] ?? ''} onChange={onChange} className={`${stylesCommon['row-fields__child']} ${stylesCommon['grow']}`} label="Phone number" placeholder="654 56 84 56" />
                                </div>
                                : <></>
                        )) || ((field.type !== 'boolean') && (
                            <InputText key={i} hint={field.hint} error={errorObj?.[field.name]} name={field.name} value={collected[field.name] ?? ''} onChange={onChange} className={stylesCommon['body__child']} label={field.humanName} type={getInputType(field)} />
                        ))
                    )
                })
            }
            <div className={`${stylesCommon['body__child']} ${push2Bottom ? '' : stylesCommon['grow']}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Continue'} disabled={!isFilled || isLoading} />
            </div>
        </main >
    )
}

const getInputType = (field: BodyFormViewType['fields'][0]) => {
    if (field.type === 'integer')
        return 'number'
    else if (field.type === 'string')
        return 'text'
    else if (field.type === 'boolean')
        return 'checkbox'
    else if (field.name === 'email')
        return 'email'
    else
        return field.type
}

BodyFormView.defaultProps = {

}

export default BodyFormView
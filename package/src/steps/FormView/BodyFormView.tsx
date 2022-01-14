import React, { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react'
import stylesCommon from '../../styles.module.css'
import styles from './styles.module.css'

import CreditCardInput from './renderers/creditCard'
import InputText from '../../common/Input/InputText'
import InputCryptoAddr from '../../common/Input/InputCryptoAddr'
import ButtonAction from '../../common/ButtonAction'
import InputButton from '../../common/Input/InputButton'
import InfoBox from '../../common/InfoBox'
import PickView from '../../PickView'
import HelpView from '../../common/HelpView'
import Help2FACreditCard from './renderers/Help2FACreditCard'

import { APIContext, StepDataItems, DEFAULT_US_STATE, DEFAULT_CA_STATE, DEFAULT_COUNTRY } from '../../ApiContext'
import type { CollectedStateType } from '../../ApiContext'
import { NavContext } from '../../NavContext'
import icons from 'rendered-country-flags'

import countryNames from '../../ApiContext/utils/countryNames'
import phoneCodes from '../../ApiContext/utils/phoneCodes'
import usStates from '../../ApiContext/utils/usStates'
import caStates from '../../ApiContext/utils/caStates'

import { scrollTo } from '../../utils'
import { GroupFieldsController } from './utils'
import BuyCryptoView from '../../BuyCryptoView'
import ChooseGatewayView from '../../ChooseGatewayView'
import { useTranslation } from 'react-i18next'

const CREDIT_CARD_FIELDS_NAME_GROUP = ['ccNumber', 'ccMonth', 'ccYear', 'ccCVV']
const PHONE_NUMBER_FIELDS_NAME_GROUP = ['phoneCountryCode', 'phoneNumber']

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: StepDataItems
    isFilled?: boolean
    isLoading?: boolean
    errorObj?: { [key: string]: string | undefined }
    errorMsg?: string
    infoMsg?: string
    inputName?: string
    onErrorDismissClick: (field?: string) => void
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { t } = useTranslation();

    const { handleInputChange, onActionButton, fields = [] } = props
    const { collected, apiInterface } = useContext(APIContext);
    const { backScreen, nextScreen, onlyScreen } = useContext(NavContext)
    const { isFilled = false, isLoading = false, errorObj, errorMsg, infoMsg } = props

    const [isRestartCalled, setIsRestartCalled] = useState(false)
    const [verifyCode, setVerifyCode] = useState('')

    const restartToAnotherGateway = () => {
        apiInterface.clearErrors()
        setIsRestartCalled(true)
    }

    useEffect(() => {
        if (isRestartCalled && !collected.errors) {
            onlyScreen(<BuyCryptoView />)
            nextScreen(<ChooseGatewayView />)
            setIsRestartCalled(false)
        }
    }, [collected.errors, isRestartCalled, onlyScreen, nextScreen])

    const formContainer = useRef<HTMLDivElement>(null);
    const generalErrorRef = useRef<HTMLDivElement>(null);
    const inputRefs = useMemo(() => {
        return [...fields, { name: 'FATAL' }].map(field => ({
            name: field.name,
            ref: React.createRef<HTMLDivElement>()
        }))
    }, [fields])

    const [countryHasChanged, setCountryHasChanged] = useState('initialkey')

    const [push2Bottom, setPush2Bottom] = useState(false)
    useEffect(() => {
        setPush2Bottom(fields.some(field => field.name === 'termsOfUse'))
    }, [fields])

    const onChange = useCallback((name: string, value: any, type?: string) => {
        let v = value
        if (v && type === 'date') {
            if (typeof value === 'string') {
                v = {
                    year: Number("0000" + value.split('-')[0].slice(-4)),
                    month: Number("00" + value.split('-')[1].slice(-2)),
                    day: Number("00" + value.split('-')[2].slice(-2))
                }
            } else {
                v = {
                    year: Number(v.year),
                    month: Number(v.month),
                    day: Number(v.day)
                }
            }
        }

        if (name === 'cryptocurrencyAddressTag') {
            handleInputChange('cryptocurrencyAddress', {
                ...collected.cryptocurrencyAddress,
                memo: v
            })
        }

        if (name === 'verifyPhoneCode' || name === 'verifyEmailCode')
            setVerifyCode(v)

        handleInputChange(name, v)

        if (name === 'country')
            setCountryHasChanged(v)

    }, [handleInputChange, collected.cryptocurrencyAddress])

    useEffect(() => {
        // setting initial values
        if (countryHasChanged === 'initialkey') {
            const country = collected.country ?? collected.selectedCountry
            handleInputChange("country", country)
            if (country.toUpperCase() === 'US')
                handleInputChange("state", collected.state && (collected.state !== "undefined") ? collected.state : DEFAULT_US_STATE)
            else if (country.toUpperCase() === 'CA')
                handleInputChange("state", collected.state && (collected.state !== "undefined") ? collected.state : DEFAULT_CA_STATE)
            else
                handleInputChange("state", "undefined")

            setCountryHasChanged('undefinedkey')
        }
        else if (countryHasChanged.toUpperCase() === 'US') {
            handleInputChange("state", collected.state && (collected.state !== "undefined") ? collected.state : DEFAULT_US_STATE)
            setCountryHasChanged('undefinedkey')
        }
        else if (countryHasChanged.toUpperCase() === 'CA') {
            handleInputChange("state", collected.state && (collected.state !== "undefined") ? collected.state : DEFAULT_CA_STATE)
            setCountryHasChanged('undefinedkey')
        }
        else if (countryHasChanged !== 'undefinedkey') {
            handleInputChange("state", 'undefined')
            setCountryHasChanged('undefinedkey')
        }
    }, [countryHasChanged, collected.country, collected.state, collected.selectedCountry, handleInputChange])

    // scroll to fields on new error (general error)
    useEffect(() => {
        if (errorMsg && generalErrorRef !== null) {
            if (generalErrorRef === null || generalErrorRef.current === null) return
            scrollTo(formContainer.current, 0, 600)
        }
    }, [errorMsg])

    // scroll to fields on new error (field error)
    useEffect(() => {
        if (errorObj && inputRefs !== null) {
            // smooth scroll to the first error
            let errName = Object.keys(errorObj)[0]

            // if the error is in any of the Credit/Debit Card fields, scoll to the first one (credit card number)
            if (CREDIT_CARD_FIELDS_NAME_GROUP.some(f => f === errName))
                errName = CREDIT_CARD_FIELDS_NAME_GROUP[0]
            else if (PHONE_NUMBER_FIELDS_NAME_GROUP.some(f => f === errName))
                errName = PHONE_NUMBER_FIELDS_NAME_GROUP[0]

            const errInput = inputRefs.find(inp => inp.name === errName)
            if (!errInput || errInput.ref.current === null) return
            const el = errInput.ref.current
            scrollTo(formContainer.current, el.parentElement!.offsetTop - el.parentElement!.getBoundingClientRect().height - 10, 600)
        }
    }, [errorObj, inputRefs])

    // Initialize group fields controller
    GroupFieldsController.initGroups()

    const groupedFieldDataPHONE = PHONE_NUMBER_FIELDS_NAME_GROUP.reduce((acc, actual) => {
        const fieldItem = fields.find(field => field.name === actual)
        if (fieldItem && fieldItem?.type !== "boolean")
            return {
                ...acc,
                [actual]: {...fieldItem}
            }
        else return acc
    }, {} as {[key:string]:any})

    const groupedFieldDataCC = CREDIT_CARD_FIELDS_NAME_GROUP.reduce((acc, actual) => {
        const fieldItem = fields.find(field => field.name === actual)
        if (fieldItem && fieldItem?.type !== "boolean")
            return {
                ...acc,
                [actual]: {...fieldItem}
            }
        else return acc
    }, {} as {[key:string]:any})

    return (
        <main ref={formContainer} className={stylesCommon.body}>
            <>
                <InfoBox in={!!infoMsg} type='info' className={`${stylesCommon.body__child}`} >
                    {infoMsg}
                </InfoBox>
                <InfoBox ref={generalErrorRef} in={!!errorMsg} type='error' canBeDismissed onDismissClick={() => props.onErrorDismissClick()} className={`${stylesCommon.body__child}`} >
                    {errorMsg}
                </InfoBox>
                <InfoBox
                    ref={inputRefs[inputRefs.length - 1].ref}
                    in={!!errorObj?.['FATAL']}
                    type='error'
                    message={errorObj?.['FATAL']}
                    className={`${stylesCommon.body__child}`}
                    actionText="Try another gateway"
                    onActionClick={restartToAnotherGateway}
                    onDismissClick={() => props.onErrorDismissClick('FATAL')}
                    canBeDismissed
                >
                    <span>{"Possible solutions:"}</span><br />
                    <span>· Use a differrent credit card.</span><br />
                    <span>· If you didn't use your real identity, start the process again providing it.</span><br />
                    <span>· Try another gateway.</span><br />
                    <span>· Contact us.</span>
                </InfoBox>
                {
                    fields.map((field, i) => {
                        return (
                            (field.name === 'cryptocurrencyAddress' && (
                                <InputCryptoAddr
                                    label={field.humanName}
                                    ref={inputRefs[i].ref}
                                    hint={field.hint}
                                    type={getInputType(field)}
                                    key={i}
                                    className={stylesCommon.body__child}
                                    handleInputChange={onChange}
                                    error={errorObj?.[field.name]}
                                    disabled={!collected.isAddressEditable}
                                />
                            ))
                            || ((field.name === 'verifyCreditCard') && (
                                <React.Fragment key={i}>
                                    <InputText
                                        value={collected[field.name] ?? ''}
                                        isRequired={field.required !== false}
                                        ref={inputRefs[i].ref}
                                        onHintClick={() => nextScreen(
                                            <HelpView buttonText={"Got it👌"} dismissAfterClick>
                                                <Help2FACreditCard />
                                            </HelpView>
                                        )}
                                        hint={"Where do I find this code?"}
                                        name={field.name} onChange={onChange}
                                        label={field.humanName}
                                        placeholder=""
                                        error={errorObj?.[field.name]}
                                        className={stylesCommon.body__child}
                                        type={getInputType(field)}
                                    />
                                    <span key={998} onClick={() => backScreen()} className={styles.resend}>Resend code&nbsp;</span>
                                </React.Fragment>
                            ))
                            || ((field.name === 'verifyPhoneCode' || field.name === 'verifyEmailCode') && (
                                <React.Fragment key={i}>
                                    <InputText
                                        isRequired={field.required !== false}
                                        ref={inputRefs[i].ref}
                                        hint={field.hint}
                                        name={field.name}
                                        onChange={onChange}
                                        label={field.humanName}
                                        placeholder=""
                                        error={errorObj?.[field.name]}
                                        className={stylesCommon.body__child}
                                        type={getInputType(field)}
                                        value={verifyCode}
                                    />
                                    <span key={999} onClick={() => backScreen()} className={styles.resend}>Resend code&nbsp;</span>
                                </React.Fragment>
                            ))
                            || ((field.type === 'boolean' && field.name === 'termsOfUse') && (
                                <label key={i} className={`${stylesCommon.body__child} ${styles.terms}`}>
                                    <input type="checkbox" checked={collected[field.name] ?? false} name={field.name} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.checked, e.currentTarget.type)} />&nbsp;{t('formView.termsAgreement')} {
                                        field.terms?.map<React.ReactNode>((term, i) => <a key={i} href={term.url} target='_blank' rel="noopener noreferrer">{term.humanName}</a>)
                                            .reduce((acc, actual, i, arr) => [acc, i === arr.length - 1 ? ` ${t('misc.and')} ` : ', ', actual])
                                    }.</label>
                            ))
                            || ((field.type === 'boolean') && (field.name === 'areFundsFromLegalSources') && (
                                <label key={i} className={`${stylesCommon.body__child} ${styles.terms}`}>
                                    <input type="checkbox" checked={collected[field.name] ?? false} name={field.name} onChange={(e) => onChange(e.currentTarget.name, e.currentTarget.checked, e.currentTarget.type)} />&nbsp;{
                                    field.humanName
                                    }</label>
                            ))
                            || ((field.type === 'select') && (
                                <InputButton ref={inputRefs[i].ref} key={i} className={stylesCommon.body__child}
                                    error={errorObj?.[field.name]}
                                    onClick={
                                        () => nextScreen(
                                            <PickView
                                                title={field.humanName}
                                                name={field.name}
                                                onItemClick={(name, index, item) => {
                                                    onChange(name, item.id)
                                                    backScreen()
                                                }}
                                                items={field.options.map((option) => ({
                                                    id: option.value,
                                                    name: option.humanName
                                                }))}
                                            />
                                        )}
                                    label={field.humanName}
                                    selectedOption={field.options.find(v=>v.value===collected[field.name])?.humanName ?? "Please select"}
                                />
                            ))
                            || ((field.name === 'country') && (
                                <InputButton ref={inputRefs[i].ref} key={i} className={stylesCommon.body__child}
                                    error={errorObj?.[field.name]}
                                    onClick={
                                        () => nextScreen(
                                            <PickView
                                                title={field.humanName}
                                                name={field.name}
                                                onItemClick={(name, index, item) => {
                                                    onChange(name, item.id.toLowerCase())
                                                    backScreen()
                                                }}
                                                items={Object.entries(countryNames).map(([code]) => ({
                                                    id: code,
                                                    name: t(`countries.${code}`),
                                                    icon: icons[code],
                                                    info: code
                                                }))}
                                                searchable
                                            />
                                        )}
                                    label={field.humanName} selectedOption={t(`countries.${(collected[field.name] ?? DEFAULT_COUNTRY).toUpperCase()}`)} icon={icons[(collected[field.name] ?? DEFAULT_COUNTRY).toUpperCase()]} />
                            )) || ((field.type === 'choice') && (
                                <InputButton ref={inputRefs[i].ref} key={i} className={stylesCommon.body__child}
                                    error={errorObj?.[field.name]}
                                    onClick={
                                        () => nextScreen(
                                            <PickView
                                                title={field.humanName}
                                                name={field.name}
                                                onItemClick={(name, index, item) => {
                                                    onChange(name, item.name)
                                                    backScreen()
                                                }}
                                                items={field.options.map((option) => ({
                                                    id: option,
                                                    name: option
                                                }))}
                                                searchable
                                            />
                                        )}
                                    label={field.humanName} selectedOption={collected[field.name] ?? `Select ${field.humanName}`} />
                            )) || ((field.name === 'state') && (
                                collected.country === 'us' || collected.country === 'ca'
                                    ? <InputButton ref={inputRefs[i].ref} key={i} className={stylesCommon.body__child} onClick={
                                        () => nextScreen(
                                            <PickView
                                                title={field.humanName}
                                                name={field.name}
                                                onItemClick={(name, index, item) => {
                                                    onChange(name, item.id.toLowerCase())
                                                    backScreen()
                                                }}
                                                items={Object.entries(collected.country === 'us'?usStates:caStates).map(([code, state]) => ({
                                                    id: code,
                                                    name: state,
                                                    info: code
                                                }))}
                                                searchable
                                            />
                                        )}
                                        label={field.humanName}
                                        selectedOption={
                                            collected.country === 'us'
                                            ? usStates[(collected.state && collected.state !== "undefined" ? collected.state : DEFAULT_US_STATE).toUpperCase()]
                                            : caStates[(collected.state && collected.state !== "undefined" ? collected.state : DEFAULT_CA_STATE).toUpperCase()]
                                        }
                                    />
                                    : <React.Fragment key={i}></React.Fragment>
                            )) || ((GroupFieldsController.isGroupRequired(field.name, CREDIT_CARD_FIELDS_NAME_GROUP, fields.map((f) => f.name))) && (
                                !GroupFieldsController.isGroupAdded(CREDIT_CARD_FIELDS_NAME_GROUP)
                                    ? <CreditCardInput
                                        fieldsGroup={groupedFieldDataCC}
                                        ref={inputRefs[i].ref}
                                        ccNumberValue={collected.ccNumber}
                                        ccMonthValue={collected.ccMonth}
                                        ccYearValue={collected.ccYear}
                                        ccCVVValue={collected.ccCVV}
                                        key={i} handleInputChange={onChange} errorObj={errorObj} />
                                    : <React.Fragment key={i}></React.Fragment>
                            )) || ((GroupFieldsController.isGroupRequired(field.name, PHONE_NUMBER_FIELDS_NAME_GROUP, fields.map((f) => f.name))) && (
                                !GroupFieldsController.isGroupAdded(PHONE_NUMBER_FIELDS_NAME_GROUP)
                                    ? <div key={i} className={`${stylesCommon.body__child} ${stylesCommon['row-fields']}`}>
                                        <InputButton
                                            hint={groupedFieldDataPHONE['phoneCountryCode']?.hint}
                                            ref={inputRefs[fields.findIndex((field) => field.name === 'phoneCountryCode')]?.ref}
                                            onClick={
                                                () => nextScreen(
                                                    <PickView
                                                        title={'Country code'}
                                                        name={'phoneCountryCode'}
                                                        onItemClick={(name, _, item) => {
                                                            onChange(name, +item.name)
                                                            onChange('country', item.id.toLowerCase())
                                                            backScreen()
                                                        }}
                                                        items={Object.entries(phoneCodes).map(([code, infoObj]) => ({
                                                            id: code,
                                                            name: infoObj.phoneCode,
                                                            info: t(`countries.${code}`),
                                                            searchWords: infoObj.searchWords
                                                        }))}
                                                        searchable
                                                    />
                                                )}
                                            className={stylesCommon['row-fields__child']} label={groupedFieldDataPHONE['phoneCountryCode'].humanName}
                                            selectedOption={'+' + collected.phoneCountryCode ?? phoneCodes[(collected.country ?? 'gb').toUpperCase()].phoneCode}
                                            error={errorObj?.phoneCountryCode}
                                        />
                                        <InputText
                                            error={errorObj?.phoneNumber}
                                            ref={inputRefs[fields.findIndex((field) => field.name === 'phoneNumber')].ref}
                                            name='phoneNumber'
                                            type='number'
                                            value={collected.phoneNumber ?? ''}
                                            onChange={onChange}
                                            className={`${stylesCommon['row-fields__child']}
                                            ${stylesCommon.grow}`}
                                            label={groupedFieldDataPHONE['phoneNumber'].humanName}
                                            placeholder="654 56 84 56"
                                            hint={groupedFieldDataPHONE['phoneNumber']?.hint}
                                        />
                                    </div>
                                    : <React.Fragment key={i}></React.Fragment>
                            )) || ((field.type !== 'boolean') && (
                                <InputText
                                    isRequired={field.required !== false}
                                    ref={inputRefs[i].ref}
                                    key={i}
                                    hint={field.hint}
                                    error={errorObj?.[field.name]}
                                    name={field.name}
                                    value={getValueByField(field, collected)}
                                    onChange={onChange}
                                    className={stylesCommon.body__child}
                                    label={field.humanName}
                                    type={getInputType(field)}
                                    disabled={field.name === 'cryptocurrencyAddressTag' && !collected.isAddressEditable}
                                />
                            ))
                        )
                    })
                }
                <div className={`${stylesCommon.body__child} ${push2Bottom ? '' : stylesCommon.grow}`}>
                    <ButtonAction onClick={onActionButton} text={isLoading ? t('kycScreens.sendingProgressMessage') : t('kycScreens.continueButtonText')} disabled={!isFilled || isLoading} />
                </div>
            </>
        </main >
    )
}

const getValueByField = (field: BodyFormViewType['fields'][0], collected: CollectedStateType) => {
    if (field.name === 'cryptocurrencyAddressTag')
        return collected["cryptocurrencyAddress"]?.memo ?? ""
    else if (field.name)
        return collected[field.name]
    else return ""
}

const getInputType = (field: BodyFormViewType['fields'][0]) => {
    if (field.type === 'integer')
        return 'number'

    if (field.name === 'email')
        return 'email'

    if (field.name === 'password')
        return 'password'

    if (field.type === 'string')
        return 'text'

    if (field.type === 'boolean')
        return 'checkbox'

    return field.type
}

BodyFormView.defaultProps = {

}

export default BodyFormView

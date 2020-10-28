import React, { useCallback } from 'react'
import styles from './styles.module.css'

import HintIcon from '../HintIcon'

import { CSSTransition } from 'react-transition-group';

type InputTextType = {
    disabled?: boolean,
    symbol?: string,
    placeholder?: string,
    label?: string,
    className?: string,
    icon?: string,
    iconPosition?: 'start' | 'end',
    symbolPosition?: 'start' | 'end',
    onChange?: (name: string, value: any, type?: string) => void
    value?: number | string
    type?: string
    name: string
    onIconClick?: (name: string, value: string, label: string) => void
    error?: string
    hint?: string
    onHelpClick?: () => void
}

const InputText = React.forwardRef<HTMLDivElement, InputTextType>((props, ref) => {
    const { symbol, label, className, icon, iconPosition, disabled, value, type, name, error, symbolPosition = 'end', hint } = props
    const placeholder = disabled ? '' : props.placeholder
    const clickableIcon = props.onIconClick ? true : false
    const { onChange = (e) => false, onIconClick = (n, v, l) => null } = props

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value === '' ? e.currentTarget.value : type === 'number' ? +e.currentTarget.value : e.currentTarget.value
        onChange(e.currentTarget.name, value, e.currentTarget.type)
    }, [onChange, type])

    const formatValue = useCallback((value?: any, type?: string) => {
        if (value)
            if (type === 'date') {
                const year = ("0000" + value.year).slice(-4);
                const month = ("00" + value.month).slice(-2);
                const day = ("00" + value.day).slice(-2);
                return `${year}-${month}-${day}`
            }
        return value
    }, [])

    return (
        <div ref={ref} className={`${styles['input']} ${className}`}>
            {label && <label>{label}{props.onHelpClick && <>&nbsp;&nbsp;<HintIcon onClick={props.onHelpClick} /></>}</label>}
            <div className={`${styles['input__type']} ${styles['input__type--number']}  ${error || error === '' ? styles['input__type--number--error'] : ''} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon && <img onClick={(e) => onIconClick(name, formatValue(value, type), label ?? 'Text')} alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? `${styles['input__type__child--old-first']} ${styles['input__icon--chevron']}` : ''} ${clickableIcon ? styles['clickable-icon'] : ''}`} data-value={value} />}
                <span before-content={symbolPosition === 'start' ? symbol : undefined} after-content={symbolPosition === 'end' ? symbol : undefined} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    <input
                        max={type === 'date' ? "9999-12-31" : undefined}
                        name={name} value={formatValue(value, type)} onChange={(e) => handleInputChange(e)} type={type} min="0" placeholder={placeholder} disabled={disabled} />
                </span>
            </div>
            <CSSTransition in={!!error}
                timeout={500}
                classNames={{
                    enter: styles['collapse-enter'],
                    enterActive: styles['collapse-enter-active'],
                    exit: styles['collapse-exit'],
                    exitActive: styles['collapse-exit-active'],
                }}
                unmountOnExit={true}>
                {error ? <span className={`${styles['text-error']}`} >{error}</span> : <></>}
            </CSSTransition>
            {hint && <span className={`${styles['text-hint']}`} >{hint}</span>}
        </div>
    )
})

InputText.defaultProps = {
    label: '\u00A0',
    className: '',
    iconPosition: 'start',
    disabled: false,
    type: 'text'
}

export default InputText
import React, { useCallback } from 'react'
import styles from './styles.module.css'

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
    onChange?: (name: string, value: any) => void
    value?: number | string
    type?: string
    name: string
    onIconClick?: (name: string) => void
    error?: string
}

const InputText: React.FC<InputTextType> = (props) => {
    const { symbol, label, className, icon, iconPosition, disabled, value, type, name, error, symbolPosition = 'end' } = props
    const placeholder = disabled ? '' : props.placeholder
    const clickableIcon = props.onIconClick ? true : false
    const { onChange = (e) => false, onIconClick = (n) => null } = props

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value === '' ? e.target.value : type === 'number' ? +e.target.value : e.target.value
        onChange(e.target.name, value)
    }, [onChange, type])

    return (
        <div className={`${styles['input']} ${className}`}>
            {label ? <label>{label}</label> : null}
            <div className={`${styles['input__type']} ${styles['input__type--number']}  ${error || error === '' ? styles['input__type--number--error'] : ''} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon ? <img onClick={() => onIconClick(name)} alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? `${styles['input__type__child--old-first']} ${styles['input__icon--chevron']}` : ''} ${clickableIcon ? styles['clickable-icon'] : ''}`} data-value={value} /> : null}
                <span before-content={symbolPosition === 'start' ? symbol : undefined} after-content={symbolPosition === 'end' ? symbol : undefined} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    <input name={name} value={value} onChange={(e) => handleInputChange(e)} type={type} min="0" placeholder={placeholder} disabled={disabled} />
                </span>
            </div>
            <CSSTransition in={error !== undefined}
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
        </div>
    )
}

InputText.defaultProps = {
    label: '\u00A0',
    className: '',
    iconPosition: 'start',
    disabled: false,
    type: 'text'
}

export default InputText
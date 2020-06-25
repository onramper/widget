import React from 'react'
import styles from './styles.module.css'

type InputTextType = {
    disabled?: boolean,
    symbol?: string,
    placeholder?: string,
    label?: string,
    className?: string,
    icon?: string,
    iconPosition?: 'start' | 'end',
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value?: number | string
    type?: string
    name: string
    onIconClick?: (e: React.MouseEvent<HTMLImageElement>) => void
}

const InputText: React.FC<InputTextType> = (props) => {
    const { symbol, label, className, icon, iconPosition, disabled, value, type, name } = props
    const placeholder = disabled ? '' : props.placeholder
    const clickableIcon = props.onIconClick ? true : false
    const { onChange = (e) => false, onIconClick = (e) => false } = props
    return (
        <div className={`${styles['input']} ${className}`}>
            {label ? <label>{label}</label> : null}
            <div className={`${styles['input__type']} ${styles['input__type--number']} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon ? <img onClick={onIconClick} alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? styles['input__type__child--old-first'] : ''} ${clickableIcon ? styles['clickable-icon'] : ''}`} data-value={value} /> : null}
                <span before-content={symbol} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    <input name={name} value={value} onChange={(e) => onChange(e)} type={type} min="0" placeholder={placeholder} disabled={disabled} />
                </span>
            </div>
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

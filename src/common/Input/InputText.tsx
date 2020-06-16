import React from 'react'
import styles from './styles.module.css'

function InputText(props: { disabled?: boolean, symbol?: string, placeholder?: string, label?: string, className?: string, icon?: string, iconPosition?: 'start' | 'end' }) {
    const { symbol, label = '\u00A0', className = '', icon, iconPosition = 'start', disabled = false } = props
    const placeholder = disabled ? '' : props.placeholder
    return (
        <div className={`${styles['input']} ${className}`}>
            {label ? <label>{label}</label> : null}
            <div className={`${styles['input__type']} ${styles['input__type--number']} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon ? <img alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? styles['input__type__child--old-first'] : ''}`} /> : null}
                <span before-content={symbol} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    <input type='number' min="0" placeholder={placeholder} disabled={disabled} />
                </span>
            </div>
        </div>
    )
}

export default InputText

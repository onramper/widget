import React from 'react'
import styles from './styles.module.css'

import IconChevronRight from '../../icons/chevron_right.svg'

type InputButtonType = {
    selectedOption: string,
    label?: string,
    icon?: string,
    className?: string,
    iconPosition?: 'start' | 'end',
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

const InputButton: React.FC<InputButtonType> = (props) => {
    const { selectedOption, label, icon, className, iconPosition } = props
    return (
        <div className={`${styles['input']} ${className}`}>
            {label ? <label>{label}</label> : null}
            <div onClick={props.onClick} className={`${styles['input__type']} ${styles['input__type--selector']} ${props.onClick ? '' : styles['input__type--selector--disabled']}`}>
                {icon ? <img alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? styles['input__type__child--old-first'] : ''}`} /> : null}
                <span style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} className={`${styles['input__type__child']} ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`}>{selectedOption}</span>
                {props.onClick ? <img alt="Chevron right" src={IconChevronRight} className={`${styles['input__type__child']} ${styles.input__icon} ${styles['input__icon--chevron']}`} /> : null}
            </div >
        </div >
    )
}

InputButton.defaultProps = {
    className: '',
    iconPosition: 'start',
    selectedOption: ''
}

export default InputButton

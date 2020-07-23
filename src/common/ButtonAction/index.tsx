import React from 'react'
import styles from './styles.module.css'

type ButtonActionType = {
    onClick?: () => void,
    text: string,
    disabled?: boolean
}

const ButtonAction: React.FC<ButtonActionType> = (props) => {
    const { onClick, text, disabled = false } = props
    return <button onClick={onClick} className={`${styles['button-action']} ${disabled ? styles['button-action--disabled'] : ''}`} disabled={disabled}>{text}</button>
}

export default ButtonAction

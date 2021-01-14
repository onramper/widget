import React from 'react'
import styles from './styles.module.css'

type ButtonActionType = {
    onClick?: () => void,
    text: string,
    disabled?: boolean
    size?: 'small' | 'large'
    className?: string
}

const ButtonAction: React.FC<ButtonActionType> = (props) => {
    const { onClick, text, disabled = false, size = 'large' } = props
    return <button
        onClick={onClick}
        className={`${styles['button-action']} ${size === 'small' ? styles['button-action--small'] : ''} ${disabled ? styles['button-action--disabled'] : ''} ${props.className}`}
        disabled={disabled}
    >
        {text}
    </button>
}

export default ButtonAction

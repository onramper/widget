import React, { useCallback, useContext } from 'react'
import styles from './styles.module.css'
import HintIcon from '../HintIcon'
import { CSSTransition } from 'react-transition-group';
import { NavContext } from '../../NavContext'
import DatePicker from './DatePicker'
import IconCalendar from '../../icons/date-input.png'
import DateModule from './DatePicker/DateModule'
import type { DateType } from './DatePicker'

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
    value?: number | string | DateType
    type?: string
    name: string
    onIconClick?: (name: string, value: string, label: string) => void
    error?: string
    hint?: string
    onHelpClick?: () => void
    clickableIcon?: boolean
}

const InputText = React.forwardRef<HTMLDivElement, InputTextType>((props, ref) => {
    const { backScreen, nextScreen } = useContext(NavContext)
    const { symbol, label = '\u00A0', className, disabled, value, type = 'text', name, error, symbolPosition = 'end', hint } = props
    const placeholder = disabled ? '' : props.placeholder
    const clickableIcon = props.clickableIcon || props.onIconClick ? true : false
    const { onChange = (e) => false, onIconClick = (n, v, l) => null } = props
    const dateSupported = type === 'date' ? isTypeSupported(type) ? true : false : true
    const icon = !dateSupported ? IconCalendar : props.icon
    const iconPosition = !dateSupported ? 'end' : props.iconPosition
    const classPrefix = !dateSupported ? '--date' : '--chevron'

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value === '' ? e.currentTarget.value : type === 'number' ? +e.currentTarget.value : e.currentTarget.value
        if (e.currentTarget.type === 'date' && typeof value === 'string') {
            const date = {
                year: value.split('-')[0],
                month: value.split('-')[1],
                day: value.split('-')[2]
            }
            onChange(e.currentTarget.name, date, e.currentTarget.type)
            return
        }
        onChange(e.currentTarget.name, value, e.currentTarget.type)
    }, [onChange, type])

    const formatValue = (value?: any, type?: string) => {
        if (!value) return value
        if (type === 'date') {
            const year = ("0000" + String(value.year)).slice(-4);
            const month = ("00" + String(value.month)).slice(-2);
            const day = ("00" + String(value.day)).slice(-2);
            return `${year}-${month}-${day}`
        }
        return value
    }

    const _onIconClick = () => {
        if (!dateSupported) {
            nextScreen(
                <DatePicker
                    name={props.name}
                    onChange={(name, value) => {
                        onChange(name, value)
                        backScreen()
                    }}
                    value={value as DateType}
                />
            )
        }
        else
            onIconClick(name, formatValue(value, type), label)
    }

    return (
        <div ref={ref} className={`${styles['input']} ${className}`}>
            {label && <label>{label}{props.onHelpClick && <>&nbsp;&nbsp;<HintIcon onClick={props.onHelpClick} /></>}</label>}
            <div className={`${styles['input__type']} ${styles['input__type--number']}  ${error || error === '' ? styles['input__type--number--error'] : ''} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon && <img onClick={(e) => _onIconClick()} alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? `${styles['input__type__child--old-first']} ${styles['input__icon' + classPrefix]}` : ''} ${clickableIcon ? styles['clickable-icon'] : ''}`} data-value={value} />}
                <span before-content={symbolPosition === 'start' ? symbol : undefined} after-content={symbolPosition === 'end' ? symbol : undefined} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    {
                        dateSupported ?
                            <input
                                max={type === 'date' ? "9999-12-31" : undefined}
                                name={name} value={formatValue(value, type)} onChange={(e) => handleInputChange(e)} type={type} min="0" placeholder={placeholder} disabled={disabled} />
                            : <DateModule name={name} value={formatValue(value, type)} onChange={onChange} />
                    }
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

const isTypeSupported = (type: string) => {
    const datefield = document.createElement("input")
    datefield.setAttribute("type", type)
    return (datefield.type === type)
}

InputText.defaultProps = {
    label: '\u00A0',
    className: '',
    iconPosition: 'start',
    disabled: false,
    type: 'text'
}

export default InputText

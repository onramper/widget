import React, { useCallback, useState, useEffect } from 'react'
import styles from './styles.module.css'

import { toMaxDecimalsRound } from '../../wrappers/utils'

import { ListItemType } from '../../common/types';

type InputTextType = {
    disabled?: boolean,
    symbol?: string
    symbols?: ListItemType[],
    placeholder?: string,
    label?: string,
    className?: string,
    icon?: string,
    iconPosition?: 'start' | 'end',
    onChange?: (name: string, value: any) => void
    value?: number | string
    type?: string
    name: string
    onIconClick?: (name: string) => void
    error?: string
    onSymbolChange?: (symbol: ListItemType | undefined) => void
}

const InputText: React.FC<InputTextType> = (props) => {
    const { symbols, label, className, icon, iconPosition, disabled, value, type, name, error, onSymbolChange = (s: any) => null } = props
    const placeholder = disabled ? '' : props.placeholder
    const clickableIcon = props.onIconClick ? true : false
    const { onChange = (e) => false, onIconClick = (n) => null } = props

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value === '' ? e.target.value : type === 'number' ? +e.target.value : e.target.value
        onChange(e.target.name, value)
    }, [onChange, type])

    const [actualSymbol, setActualSymbol] = useState<ListItemType>()
    const [actualSymbolIndex, setActualSymbolIndex] = useState(0)
    const [switchPairEnabled, setSwitchPairEnabled] = useState(true)
    useEffect(() => {
        if (!symbols || symbols.length <= 0) return
        const nonFungible = symbols.find((symbol: ListItemType) => symbol.precision === 0)
        if (nonFungible) {
            setActualSymbol(nonFungible)
            setSwitchPairEnabled(false)
        }
        else {
            setActualSymbol(symbols[0])
            setActualSymbolIndex(0)
            setSwitchPairEnabled(true)
        }
    }, [symbols])

    useEffect(() => {
        onSymbolChange(actualSymbol)
    }, [actualSymbol, onSymbolChange])

    const handleSwitchPair = (index: number) => {
        if (symbols) {
            setActualSymbolIndex(index)
            setActualSymbol(symbols[index])
        }
    }

    return (
        <div className={`${styles['input']} ${className}`}>
            {label && <label><span className={styles['label__title']}>{label}</span>{switchPairEnabled && symbols && <SwitchPairs onClick={handleSwitchPair} pairs={symbols} indexSelectedNumber={actualSymbolIndex} />}</label>}
            <div className={`${styles['input__type']} ${styles['input__type--number']}  ${error || error === '' ? styles['input__type--number--error'] : ''} ${disabled ? styles['input__type--number--disabled'] : ''}`}>
                {icon ? <img onClick={() => onIconClick(name)} alt="Icon" src={icon} className={`${styles['input__type__child']} ${styles.input__icon} ${iconPosition === 'end' ? `${styles['input__type__child--old-first']} ${styles['input__icon--chevron']}` : ''} ${clickableIcon ? styles['clickable-icon'] : ''}`} data-value={value} /> : null}
                <span before-content={actualSymbol ? actualSymbol.symbol ? actualSymbol.symbol + ' ' : '' : ''} className={`${styles['input__type__child']} ${styles.symbol}  ${iconPosition === 'end' ? styles['input__type__child--new-first'] : ''}`} style={{ 'order': iconPosition === 'end' ? -1 : 'unset' }} >
                    <input
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                            if (e.currentTarget.value) {
                                let san = toMaxDecimalsRound(e.currentTarget.value, actualSymbol ? actualSymbol.precision ?? 0 : 0)
                                e.currentTarget.value = san.toString()
                            }
                        }}
                        step={actualSymbol?.precision !== undefined ? Number('1e-' + actualSymbol.precision) : 'any'}
                        name={name}
                        value={value}
                        onChange={(e) => handleInputChange(e)} type={type} min="0" placeholder={placeholder}
                        disabled={disabled} />
                </span>
            </div>
            <span className={`${styles['text-error']}`} >{error}</span>
        </div>
    )
}

const SwitchPairs: React.FC<{ pairs: ListItemType[], onClick: (index: number) => void, indexSelectedNumber: number }> = ({ pairs, indexSelectedNumber, onClick }) => {
    return (
        <>
            {pairs.map((item: ListItemType, index: number) => {
                const isSelected = indexSelectedNumber === index
                return (
                    <span key={index}>
                        <span onClick={!isSelected ? () => onClick(index) : () => null} className={`${styles['label__symbol']} ${isSelected ? styles['label__symbol--selected'] : ''}`} >
                            {item.name}
                        </span>
                        <span>{index < pairs.length - 1 ? '\u00A0/\u00A0' : ''}</span>
                    </span>
                )
            }
            )}
        </>
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

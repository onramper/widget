import React, { MouseEventHandler, useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'

interface DateModuleType {
    name: string
    value?: string
    onChange?: (name: string, value: any, type?: string) => void
}

const DEFAULT_VALUE = {
    day: 'dd',
    month: 'mm',
    year: 'yyyy'
}


const DateModule: React.FC<DateModuleType> = (props) => {
    const [selectedValue, setSelectedValue] = useState<string>()
    const [selectedCount, setSelectedCount] = useState(0)
    const inputRef = useRef<HTMLDivElement>(null)

    const { value = "yyyy-mm-dd" } = props
    const valueObject = value ? {
        year: value.split('-')[0],
        month: value.split('-')[1],
        day: value.split('-')[2]
    } : DEFAULT_VALUE

    const onChange = props.onChange || ((a, b, c) => null)

    useEffect(() => {
        const reff = inputRef.current
        if (reff === null) return

        const callBack = (event: MouseEvent) => {
            const withinBoundaries = event.composedPath().includes(reff)
            if (!withinBoundaries) setSelectedValue(undefined)
        }

        document.addEventListener('click', callBack)

        return () => document.removeEventListener('click', callBack)
    }, []);

    useEffect(() => {
        const reff = inputRef.current
        if (reff === null) return

        const callBack = (event: KeyboardEvent) => {
            if (!selectedValue) return

            if (event.key === 'Tab') {
                event.preventDefault()
                if (selectedCount < 1) {
                    setSelectedCount(2)
                    setSelectedValue('month')
                }
                else if (selectedCount < 3) {
                    setSelectedCount(4)
                    setSelectedValue('year')
                }
                else {
                    setSelectedValue(undefined)
                }
            }

            if (!Number.isInteger(+event.key)) return
            onChange(props.name, date2Object(value, event.key, selectedValue), 'date')

            if (selectedCount === 1) {
                setSelectedValue('month')
            }
            else if (selectedCount === 3) {
                setSelectedValue('year')
            }

            setSelectedCount(old => ++old)
        }

        document.addEventListener('keydown', callBack)

        return () => document.removeEventListener('keydown', callBack)

    }, [onChange, props.name, selectedValue, value, selectedCount]);

    const onClick: MouseEventHandler<HTMLSpanElement> = (e) => {
        const id = e.currentTarget.id
        if (id === 'day' && selectedValue !== 'day')
            setSelectedCount(0)
        else if (id === 'month' && selectedValue !== 'month')
            setSelectedCount(2)

        setSelectedValue(e.currentTarget.id)
    }

    return (
        <div ref={inputRef} className={styles['date']}>
            <span id="day" className={`${styles.noselect} ${selectedValue === 'day' ? styles['date-item--selected'] : ''}`} onClick={onClick}>{valueObject.day}</span>
            <span className={styles.noselect}>/</span>
            <span id="month" className={`${styles.noselect} ${selectedValue === 'month' ? styles['date-item--selected'] : ''}`} onClick={onClick}>{valueObject.month}</span>
            <span className={styles.noselect}>/</span>
            <span id="year" className={`${styles.noselect} ${selectedValue === 'year' ? styles['date-item--selected'] : ''}`} onClick={onClick}>{valueObject.year}</span>
        </div>
    )
}

const date2Object = (value: string, key: string = "", id: string = "") => {
    let date = {
        year: value.split('-')[0],
        month: value.split('-')[1],
        day: value.split('-')[2]
    }

    if (id === 'year')
        date.year = ("0000" + date.year + key).slice(-4).split('y').join('0')
    else if (id === 'month')
        date.month = ("00" + date.month + key).slice(-2).split('m').join('0')
    else if (id === 'day')
        date.day = ("00" + date.day + key).slice(-2).split('d').join('0')


    return date
}

export default DateModule
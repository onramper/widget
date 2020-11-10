import React from 'react'
import HelpView from '../../../common/HelpView'
import Calendar from 'react-calendar';
import './calendar.css';

export interface DateType {
    day: number, month: number, year: number
}

interface DatePickerType {
    name: string
    value?: DateType
    onChange?: (name: string, value: any, type?: string) => void
}

const DatePicker: React.FC<DatePickerType> = (props) => {

    const startDate = props.value ? new Date(props.value.year, props.value.month, props.value.day) : undefined

    return (
        <HelpView maxHeight={'315px'} fixedHeight>
            <Calendar
                maxDate={new Date()}
                onChange={date => {
                    if (props.onChange && date instanceof Date) {
                        const formattedDate = date.toLocaleDateString('en-CA', {})
                        props.onChange(props.name, {
                            year: +formattedDate.split('-')[0],
                            month: +formattedDate.split('-')[1],
                            day: +formattedDate.split('-')[2]
                        })
                    }
                }}
                activeStartDate={startDate}
            />
        </HelpView>
    )
}

export default DatePicker
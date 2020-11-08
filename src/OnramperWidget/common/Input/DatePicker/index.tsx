import React from 'react'
import HelpView from '../../../common/HelpView'
import Calendar from 'react-calendar';
import './calendar.css';

interface DatePickerType {
    name: string
    value?: string
    onChange?: (name: string, value: any, type?: string) => void
}

const DatePicker: React.FC<DatePickerType> = (props) => {

    return (
        <HelpView maxHeight={'315px'} fixedHeight>
            <Calendar
                maxDate={new Date()}
                onChange={date => {
                    if (props.onChange && date instanceof Date) {
                        const formattedDate = date.toLocaleDateString('en-CA', {})
                        props.onChange(props.name, {
                            year: formattedDate.split('-')[0],
                            month: formattedDate.split('-')[1],
                            day: formattedDate.split('-')[2]
                        })
                    }
                }}
            />
        </HelpView>
    )
}

export default DatePicker
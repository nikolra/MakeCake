import * as React from 'react';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';
import './date-picker.style.css'

interface IProps {
    setValueDelegate: Function
}

export default function BasicDatePicker({setValueDelegate}: IProps) {

    const [value, setValue] = React.useState<Dayjs | null>(dayjs((new Date()).toISOString().split('T')[0]));

    return (
        <div className="date-picker">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                        label="Due Date"
                        value={(value)}
                        onChange={(newValue) => {
                            setValue(newValue);
                            setValueDelegate(newValue);

                        }}/>
                </DemoContainer>
            </LocalizationProvider>
        </div>
    );
}
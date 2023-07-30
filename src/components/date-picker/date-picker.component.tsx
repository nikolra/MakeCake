import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs, {Dayjs} from 'dayjs';
import './date-picker.style.css'
import React, {useEffect} from 'react';
interface IProps {
    setValueDelegate: Function,
    initValue?: string
}

export default function BasicDatePicker({setValueDelegate, initValue}: IProps) {

    const [value, setValue] = React.useState<Dayjs | null>(initValue?dayjs(initValue):dayjs((new Date()).toISOString().split('T')[0]));
    //const [value, setValue] = React.useState<Dayjs | null>(initValue ? dayjs(initValue, 'MM/DD/YYYY') : dayjs());

    useEffect(() => {
        
        setValue(initValue ? dayjs(initValue): dayjs());
    }, [initValue]);

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
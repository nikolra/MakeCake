import React, {useState} from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IProps {
    label: string,
    setValueDelegate: Function,
    value?: number,
    width?: number
}

const InputField: React.FC<IProps> = ({setValueDelegate, label, value, width}: IProps) => {
    const [errorString, setErrorString] = useState('');

    const actualWidth = width ? width : 250
    return (
        <Box
            component="div"
            sx={{
                width: {actualWidth},
                maxWidth: '100%',
                m: '0 0 6px 0'
            }}
        >
            <TextField
                id="outlined-number"
                label={label}
                type="number"
                defaultValue={value}
                inputProps={{ min: 0, inputMode: "numeric", pattern: '[0-9]+' }}
                onChange={(e) => {
                    console.log(`${label}: ${e.target.value}`);
                    setValueDelegate(e.target.value);
                }}
            />
        </Box>
    )
}

export default InputField

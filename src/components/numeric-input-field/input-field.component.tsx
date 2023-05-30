import React, {useState} from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IProps {
    label: string,
    setValueDelegate: Function,
    value?: number
}

const InputField: React.FC<IProps> = ({setValueDelegate, label, value}: IProps) => {
    const [errorString, setErrorString] = useState('');

    return (
        <Box
            component="div"
            sx={{
                width: 250,
                maxWidth: '100%',
                m: 1
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

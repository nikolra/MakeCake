import React, {useState} from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IProps {
    label: string,
    setValueDelegate: Function
}

const InputField: React.FC<IProps> = ({setValueDelegate, label}: IProps) => {
    const [errorString, setErrorString] = useState('');

    const handleNumberChange = (id: number, key: string, value: string) => {
        if (["e", "E", "-"].some((char) => value.includes(char))) return;

        // handle change here
    };

    return (
        <Box
            component="form"
            sx={{
                width: 250,
                maxWidth: '100%',
                m: 1
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                id="outlined-number"
                label={label}
                type="number"
                onChange={(e) => {
                    handleNumberChange(1, "Id", e.target.value);
                    console.log(`${label}: ${e.target.value}`);
                    setValueDelegate(e.target.value);
                }}
            />
        </Box>
    )
}

export default InputField

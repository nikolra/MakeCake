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
    return (
        <Box
            component="form"
            sx={{
                width: 500,
                maxWidth: '100%',
                m: 1
            }}
            noValidate
            autoComplete="off"
        >
            <TextField fullWidth id="outlined-basic" label={label} variant="outlined" onChange={(e: any) => {
                console.log(`${label}: ${e.target.value}`)
                setValueDelegate(e.target.value)
            }}/>
        </Box>
    )
}

export default InputField

import React, {useState} from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IProps {
    label: string,
    setValueDelegate: Function,
    width: number,
    value?: string,
    disabled?: boolean,
    margin?: string
}

const InputField: React.FC<IProps> = ({setValueDelegate, label, width, value, disabled = false, margin}: IProps) => {
    const [errorString, setErrorString] = useState('');
    const m = margin ? margin : '0 0 6px 0';
    return (
        <Box
            component="div"
            sx={{
                width: width,
                maxWidth: '100%',
                m: m
            }}
        >
            <TextField disabled={disabled} fullWidth id="outlined-basic" label={label} variant="outlined" defaultValue={value}
                       onChange={(e: any) => {
                console.log(`${label}: ${e.target.value}`)
                setValueDelegate(e.target.value)
            }}/>
        </Box>
    )
}

export default InputField

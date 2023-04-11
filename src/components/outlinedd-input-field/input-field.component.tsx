import React, {useState} from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IProps {
    label: string,
    setValueDelegate: Function,
    width: number
}

const InputField: React.FC<IProps> = ({setValueDelegate, label, width}: IProps) => {
    const [errorString, setErrorString] = useState('');
    return (
        <Box
            component="div"
            sx={{
                width: width,
                maxWidth: '100%',
                m: 1
            }}
        >
            <TextField fullWidth id="outlined-basic" label={label} variant="outlined" onChange={(e: any) => {
                console.log(`${label}: ${e.target.value}`)
                setValueDelegate(e.target.value)
            }}/>
        </Box>
    )
}

export default InputField

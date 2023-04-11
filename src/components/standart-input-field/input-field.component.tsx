import React, { useState } from 'react';
import './input-field.style.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface IInputProps{
    placeholder?: string,
    required?: boolean,
    type?: string,
    onChange?: any,
    value?: string
}

const InputField: React.FC<IInputProps> = (props: IInputProps) => {
    const [errorString, setErrorString] = useState('');

    return (
        <Box
            component="div"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            onChange={props.onChange}
        >
            <TextField id="standard-basic" label={props.placeholder} variant="standard" />
        </Box>
    )
}

InputField.defaultProps = {
    placeholder: '',
    required: false,
    type: 'text',
    value: undefined
}

export default InputField

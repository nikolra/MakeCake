import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface IProps {
    setValueDelegate: Function,
    label: string
}

const ComboBox = ({setValueDelegate, label}: IProps) => {
    const [names, setNames] = useState(options);
    const [value, setValue] = React.useState<string | null>(options[0]);
    return (
        <div className="combo-box">
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={value}
                onChange={(event: any, newValue: string | null) => {
                    setValue(newValue);
                    setValueDelegate(newValue);
                }}
                options={names}
                sx={{width: 300}}
                renderInput={(params) => <TextField {...params} label={label}/>}
            />
        </div>
    )
}

const options = [
    "Nikol", "Eden", "Amit", "Tomer"
]

export default ComboBox;

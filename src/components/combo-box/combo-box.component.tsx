import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface IProps {
    setValueDelegate: Function,
    initialValue?: string,
    label: string,
    options: string[],
    isDisabled?: boolean
}

const ComboBox = ({setValueDelegate, label, options, initialValue = "", isDisabled = false}: IProps) => {
    const [names, setNames] = useState(options);
    const [value, setValue] = React.useState<string | null>(initialValue);
    return (
        <div className="combo-box">
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={value}
                disabled = {isDisabled}
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

export default ComboBox;

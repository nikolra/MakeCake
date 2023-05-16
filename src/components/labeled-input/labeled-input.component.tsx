import React, { useState } from 'react'
import './labeled-input.style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

interface IInputProps{
    title?: string,
    placeholder?: string,
    required?: boolean,
    className?: string,
    inputClassName?: string,
    type?: string,
    onChange?: any,
    value?: string,
}

const LabeledField: React.FC<IInputProps> = (props: IInputProps) => {
    const [errorString, setErrorString] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const changeVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    return (
        <div className={ props.className + " input-container" }>
            {props.title ? <span className="input-label">{props.title}</span> : null }

            <div className={props.inputClassName + " input-border-container"}>
                <input  
                className="input"  
                placeholder={props.placeholder}  
                type={
                    props.type === 'password' ?
                        !passwordVisible ? "password":""
                        : props.type
                }
                required={props.required}
                onChange={props.onChange}
                />
                {
                    props.type === 'password' ?
                        <div className="password-visibility-button" onClick={ changeVisibility }>
                            <FontAwesomeIcon icon={ !passwordVisible ? solid('eye') : solid('eye-slash') } />
                        </div>
                    : null
                }
            </div>

            {errorString ? 
                <div className="input-error-container">
                <FontAwesomeIcon icon={ solid('circle-exclamation') } />
                <span className="input-error-label">{errorString}</span>
            </ div>
            : null }
        </div>
    )
}

LabeledField.defaultProps = {
    title: '',
    placeholder: '',
    required: false,
    className: '',
    type: 'text'
}

export default LabeledField
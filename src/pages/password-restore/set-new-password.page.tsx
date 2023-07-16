import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import '../../App.css';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import validator from 'validator';

export default function SetNewPasswordPage() {

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [code, setCode] = useState("");
    const [isValidCode, setIsValidCode] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();

    const codeValidator = (barcode: string) => {
        return /^-?\d+$/.test(barcode);
    }

    const sendDataToBackend = async () => {
        if (!isValidEmail)
            toast.error(`Please enter a valid email address`);
        else if(!isValidCode)
            toast.error(`Please enter valid authentication code`);
        else if(!newPassword)
            toast.error(`Please your new password`);
        else if(!repeatPassword)
            toast.error(`Please repeat your new password`);
        else {
            //TODO - Amit implement integration
            try {
                toast.promise(async () => {
                    navigate('/');
                    // const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customer', payload);
                }, {
                    // @ts-ignore
                    loading: 'Loading',
                    // success: `Created customer ${customerName}, ${email}`,
                    // error: `Error creating customer ${customerName}, ${email}`
                });
            } catch (error) {
                console.error(JSON.stringify(error));
            }
        }
    };

    return (
        <div className="pages">
            <div className="data-container">
                <div className="inputs-container">
                    <LogoComponent/>
                    <div className="inputs-container">
                        <LabeledField title='Auth code' placeholder='Enter received authentitaction code' required={true}
                                      onChange={(e: any) => {
                                          const value = e.target.value
                                          setIsValidCode(codeValidator(value))
                                          setCode(value)
                                      }}/>
                        <LabeledField title='Email' placeholder='Enter your email' type="email" required={true}
                                      onChange={(e: any) => {
                                          const value = e.target.value
                                          setIsValidEmail(validator.isEmail(value))
                                          setEmail(value)
                                      }}/>
                        <LabeledField title='Password' placeholder='Enter your new password password' type="password" required={true}
                                      onChange={(e: any) => {
                                          setNewPassword(e.target.value)
                                      }}/>
                        <LabeledField title='Repet password' placeholder='Enter new password again' type="password" required={true}
                                      onChange={(e: any) => {
                                          setRepeatPassword(e.target.value)

                                      }}/>
                        <button className='button button-gradient' type='submit' onClick={sendDataToBackend}>Send</button>
                    </div>
                </div>
            </div>
            <DonutPanel/>
            <ToastContainer/>
        </div>
    )
}
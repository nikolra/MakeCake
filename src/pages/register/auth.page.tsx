import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import '../../App.css';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

export default function AuthPage() {

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const navigate = useNavigate();


    const sendDataToBackend = async () => {
        //TODO - Amit implement integration
        try {
            toast.promise(async ()=> {
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
    };

    return (
        <div className="pages">
            <div className="data-container">
                <div className="inputs-container">
                    <LogoComponent/>
                    <div className="inputs-container">
                        <LabeledField title='Email' placeholder='Enter your email' type="email" required={true}
                                      onChange={(e: any) => {
                                          setEmail(e.target.value)
                                      }}/>
                        <LabeledField title='code' placeholder='Enter received code' required={true}
                                      onChange={(e: any) => {
                                          setCode(e.target.value)
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
import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import './password-restore.style.css'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import validator from 'validator';
import {toast, ToastContainer} from "react-toastify";
import Cookies from "js-cookie";

export default function PasswordRestore() {

    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(false);

    const navigate = useNavigate();

    function passwordRestoration() {
        if (!isValidEmail)
            toast.error(`Please enter a valid email address`);
        else {
            //TODO: Amit implement login with cognito
            console.log('Password restoration');
            navigate('/set-new-password');
        }
    }

    return (
        <div className="pages">
            <DonutPanel/>
            <div className="data-container">
                <div className="elements-container">
                    <span className="head-text">Forgot you password?</span>
                    <span>Please enter the email address that you used when you created your account. <br/>We will send you an email with instructions on how to reset your password.</span>
                    <div className="buttons-container">
                        <LabeledField className="input-field" placeholder='Enter your email' required={true}
                                      onChange={(e: any) => {
                                          const value = e.target.value
                                          setIsValidEmail(validator.isEmail(value))
                                          setEmail(value)
                                      }}/>
                        <button className="button button-gradient forgot-buttons-width"
                                onClick={passwordRestoration}>Send
                        </button>
                        <Link className="button button-bordered forgot-buttons-width" to="/">Sign In</Link>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

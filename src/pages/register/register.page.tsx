import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import '../../App.css';
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();


    const tryRegister = async () => {
        const body = {
            email: email,
            phone_num: "+972541111111",
            given_name: firstName,
            family_name: lastName,
            repeat_password: repeatPassword,
            password: password
        };
        try {
            console.log(body);
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/signup', body, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*'
                }
            })
            
            if (response.status === 200) {
                toast.success("Registration successful");
                navigate('/');
            } else {
                toast.error("Registration failed");
                console.error("Registration failed", response.data.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === "Passwords do not match") {
                    toast.error("Passwords do not match");
                } else if (error.message === "An account with the given email already exists.") {
                    toast.error("A user with this email already exists");
                } else {
                    toast.error("Registration failed");
                    console.error("Registration failed", error);
                }
            }
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
                        <LabeledField title='First name' placeholder='Enter your first name' required={true}
                                      onChange={(e: any) => {
                                          setFirstName(e.target.value)
                                      }}/>
                        <LabeledField title='Last name' placeholder='Enter your last name' required={true}
                                      onChange={(e: any) => {
                                          setLastName(e.target.value)
                                      }}/>
                        <LabeledField title='Password' placeholder='Enter password' type="password" required={true}
                                      onChange={(e: any) => {
                                          setPassword(e.target.value)
                                      }}/>
                        <LabeledField title='Password repeat' placeholder='Repeat password' type="password"
                                      required={true} onChange={(e: any) => {
                            setRepeatPassword(e.target.value)
                        }}/>
                        <button className='button button-gradient' type='submit' onClick={tryRegister}>Sign Up</button>
                    </div>
                    <Link className='button button-bordered' to="/">Sign In</Link>
                </div>
            </div>
            <DonutPanel/>
            <ToastContainer/>
        </div>
    )
}
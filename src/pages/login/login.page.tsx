import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import CheckBox from '../../components/checkbox/checkbox.component'
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import './login.style.css';

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()


    const tryLogin = async () => {
        const body = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/login', body, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': '*'
                    }
                }
            )
            // Assuming the response contains a token field
            console.log(response);
            const token = response.data.body.token;

            console.log(token);
            if (token && response.status === 200) {
                navigate('/dashboard');
            } else {
                console.error('Login failed: ', response.data.message);
                toast.error('Login failed')
            }
        } catch (error) {
            console.error('Error during login:', error)
            toast.error('Error during login')
        }
    };


    return (
        <div className="pages">
            <DonutPanel/>
            <div className="data-container">
                <div className="inputs-container">
                    <LogoComponent/>
                    <div className="inputs-container">
                        <LabeledField title='Login or email' placeholder='Enter your login or email' required={true}
                                      onChange={(e: any) => {
                                          setEmail(e.target.value)
                                      }}/>
                        <LabeledField title='Password' placeholder='Enter your password' type="password" required={true}
                                      onChange={(e: any) => {
                                          setPassword(e.target.value)
                                      }}/>
                        <div className="remember-forgot-container">
                            <CheckBox text="Remember me"/>
                            <Link className={'forgot-button'} to="forgot-password">Forgot password</Link>
                        </div>
                        <button className='button button-gradient' onClick={tryLogin}>Sign In</button>
                    </div>
                    <div>
                        <Link className='sign-up-button button button-bordered' to="register">Sign Up</Link>
                        <Link className='button button-bordered auth-button' to="register/auth">Authenticate</Link>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

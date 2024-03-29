import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import './login.style.css';
import Cookies from 'js-cookie';

export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    useEffect(()=> {
        if (Cookies.get('makecake-token')) {
            navigate('/dashboard');
            return;
        }
    },[]);

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
                    }});
            const token = response.data.body.idToken;
            if (token && response.data.statusCode === 200) {
                Cookies.set('makecake-token', response.data.body.idToken, { expires: 1 });
                Cookies.set('makecake-accessToken', response.data.body.accessToken, { expires: 1 });
                navigate('/dashboard');
            } else {
                console.error('Login failed: ', response);
                toast.error(JSON.stringify(response.data.body));
            }
        } catch (error) {
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

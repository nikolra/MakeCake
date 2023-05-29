import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import './password-restore.style.css'
import LabeledField from '../../components/labeled-input/labeled-input.component'

export default function PasswordRestore() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function passwordRestoration(){
        //TODO: Amit implement login with cognito
        console.log('Password restoration');
        navigate('/');
    }

    return (
    <div className="pages">
      <DonutPanel />
      <div className="data-container">
        <div className="elements-container">
          <span className="head-text">Forgot you password?</span>
          <span>Please enter the email address that you used when you created your account. <br/>We will send you an email with instructions on how to reset your password.</span>
          <div className="buttons-container">
            <LabeledField className="input-field" placeholder='Enter your email' required={true} onChange={ (e : any) => { setEmail(e.target.value) }}/>
              <button className="button button-gradient forgot-buttons-width" onClick={passwordRestoration}>Send</button>
              <Link className="button button-bordered forgot-buttons-width" to="/" >Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

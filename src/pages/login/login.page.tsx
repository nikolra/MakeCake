import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import CheckBox from '../../components/checkbox/checkbox.component'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function tryLogin(){
    //TODO: Amit implement login with cognito
    console.log('Try login');
    navigate('/dashboard');
  }

  return (
    <div className="pages">
      <DonutPanel />
      <div className="data-container">
        <div className="inputs-container">
          <LogoComponent />
          <form className="inputs-container" onSubmit={tryLogin}>
            <LabeledField title='Login or email' placeholder='Enter your login or email' required={true} onChange={ (e : any) => { setEmail(e.target.value) }}/>
            <LabeledField title='Password' placeholder='Enter your password' type="password" required={true} onChange={ (e : any) => { setPassword(e.target.value)} }/>
            <div className="remember-forgot-container">
              <CheckBox text="Remember me" />
              <Link className={'forgot-button'} to="forgot-password">Forgot password</Link>
            </div>
            <button className='button button-gradient' type='submit' >Sign In</button>
          </form>
          <Link className='button button-bordered' to="register" >Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

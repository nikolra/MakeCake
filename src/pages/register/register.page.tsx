import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import '../../App.css';

export default function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();


  function tryRegister(){
    //TODO: Amit implement registration with cognito
    console.log('Try register');
    navigate('/');
  }

  return (
    <div className="pages">
      <div className="data-container">
        <div className="inputs-container">
          <LogoComponent />
          <form className="inputs-container" onSubmit={tryRegister}>
            <LabeledField title='Email' placeholder='Enter your email' type="email" required={true} onChange={ (e : any) => { setEmail(e.target.value) }}/>
            <LabeledField title='First name' placeholder='Enter your first name' required={true} onChange={ (e : any) => { setFirstName(e.target.value) }}/>
            <LabeledField title='Last name' placeholder='Enter your last name' required={true} onChange={ (e : any) => { setLastName(e.target.value) }}/>
            <LabeledField title='Password' placeholder='Enter password' type="password" required={true} onChange={ (e : any) => { setPassword(e.target.value) }}/>
            <LabeledField title='Password repeat' placeholder='Repeat password' type="password" required={true} onChange={ (e : any) => { setRepeatPassword(e.target.value) }}/>
            <button className='button button-gradient' type='submit'>Sign Up</button>
          </form>
          <Link className='button button-bordered' to="/" >Sign In</Link>
        </div>
      </div>
      <DonutPanel />
    </div>
  )
}
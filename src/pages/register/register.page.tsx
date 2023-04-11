import React from 'react';
import {Link} from 'react-router-dom';
import DonutPanel from '../../components/donut-panel/donut-panel.component'
import LogoComponent from '../../components/logo/logo.component'
import LabeledField from '../../components/labeled-input/labeled-input.component'
import '../../App.css';

export default function Register() {
  return (
    <div className="pages">
      <div className="data-container">
        <div className="inputs-container">
          <LogoComponent />
          <form className="inputs-container">
            <LabeledField title='Login' placeholder='Enter your login' required={true}/>
            <LabeledField title='Email' placeholder='Enter your email' type="email" required={true}/>
            <LabeledField title='First name' placeholder='Enter your first name' required={true}/>
            <LabeledField title='Last name' placeholder='Enter your last name' required={true}/>
            <LabeledField title='Password' placeholder='Enter password' type="password" required={true}/>
            <LabeledField title='Password repeat' placeholder='Repeat password' type="password" required={true}/>
            <button className='button button-gradient' type='submit'>Sign Up</button>
          </form>
          <Link className='button button-bordered' to="/" >Sign In</Link>
        </div>
      </div>
      <DonutPanel />
    </div>
  )
}
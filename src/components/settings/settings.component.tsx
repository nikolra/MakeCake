import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './settings.style.css'
import InputField from "../outlinedd-input-field/input-field.component";
import LabeledField from "../labeled-input/labeled-input.component";
import {ToastContainer} from "react-toastify";

interface IOrderProps{
    className?: string
}

export default function SettingsComponent({className}: IOrderProps) {

    //TODO: Amit should use the data of the connected user and not hard codded data
    const [username, setName] = useState('Ariana Broflowski');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const sendDataToBackend = () => {
        //TODO: Amit implement change password using cognito
    }

    // useEffect( () => {
    //     const filtered = settings.filter((order) => {
    //         const name = order.customer.name.toLowerCase();
    //
    //         console.log(name, searchString, name.includes(searchString))
    //
    //         return name.includes(searchString);
    //     })
    //     setFilteredsettings(filtered)
    // }, [settings, searchString])

    return (
        <div className= {`dashboard-widget-container settings-widget ${className}`}>
            <div className="settings-header">
                <InputField setValueDelegate={setName} label="Name" width={300} value={username}/>
                <LabeledField title='Password' inputClassName={"password-field-input"} placeholder='Enter your current password' type="password" required={true} onChange={ (e : any) => { setOldPassword(e.target.value)} }/>
                <LabeledField title='Password' inputClassName={"password-field-input"} placeholder='Enter your new password password' type="password" required={true} onChange={ (e : any) => { setNewPassword(e.target.value)} }/>
                <LabeledField title='Password' inputClassName={"password-field-input"} placeholder='Enter new password again' type="password" required={true} onChange={ (e : any) => { setRepeatPassword(e.target.value)} }/>
                <div className="settings-header-title-row">

                </div>
                <div className="settings-header-settings-list-title">

                </div>
                <div className="settings-update-button-container settings-update-button">
                    <button className='update-settings-button button button-gradient' onClick={sendDataToBackend}>Update</button>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}
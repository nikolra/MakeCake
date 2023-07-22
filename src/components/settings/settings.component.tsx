import React, {useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './settings.style.css'
import InputField from "../outlinedd-input-field/input-field.component";
import LabeledField from "../labeled-input/labeled-input.component";
import {toast, ToastContainer} from "react-toastify";
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import axios from "axios";

interface IOrderProps {
    className?: string
}

export default function SettingsComponent({className}: IOrderProps) {

    //TODO: Amit should use the data of the connected user and not hard codded data
    const [username, setName] = useState('Ariana Broflowski');
    const [templateName, setTemplateName] = useState('');
    const [smsTemplate, setSmsTemplate] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const updatePasswordAndName = () => {
        //TODO: Amit implement change password using cognito
    }

    const createNewSMSTemplate = () => {
        try{
            //TODO: Amit - should get connected user email
        const payload = {
            smsTemplateName:templateName,
            konditorEmail: "tomer@gmail.com",
            smsTemplateMessage:smsTemplate
        };
        toast.promise(async ()=> {
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/create_sms_template',payload);
            console.log(JSON.stringify(response));
            console.log(response.data);
        }, {
            // @ts-ignore
            loading: 'Loading',
            success: `Created template ${templateName}`,
            error: `Error creating template ${templateName}`
        });
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }

    return (
        <div className={`dashboard-widget-container settings-widget ${className}`}>
            <div className="settings-header">
                <div className="settings-header-title-col">
                    <InputField setValueDelegate={setName} label="Name" width={300} value={username}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"} className={'setting-label-field'}
                                  placeholder='Enter your current password' type="password" required={true}
                                  onChange={(e: any) => {
                                      setOldPassword(e.target.value)
                                  }}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"} className={'setting-label-field'}
                                  placeholder='Enter your new password password' type="password" required={true}
                                  onChange={(e: any) => {
                                      setNewPassword(e.target.value)
                                  }}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"} className={'setting-label-field'}
                                  placeholder='Enter new password again' type="password" required={true}
                                  onChange={(e: any) => {
                                      setRepeatPassword(e.target.value)
                                  }}/>
                    <div className="settings-button-container settings-update-button-container">
                        <button className='settings-button'
                                onClick={updatePasswordAndName}>Update
                        </button>
                    </div>
                </div>
                <div className="settings-header-title-col">
                    <div className="">
                        <InputField setValueDelegate={setTemplateName} label="SMS Template Title" width={300} value={templateName}/>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': {m:'2vh 0 0 0', width: '100%'},
                            }}
                            noValidate

                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="SMS template"
                                    multiline
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: '25vh'
                                        }
                                    }}
                                    onChange={(e: any) => {
                                        setSmsTemplate(e.target.value);
                                    }}
                                    defaultValue="Write the template here. You can use name, from time, to time, place holders"
                                    value={smsTemplate}
                                />
                            </div>
                        </Box>
                        <div className="settings-button-container settings-add-template-button-container">
                            <button className='settings-button'
                                    onClick={createNewSMSTemplate}>create template
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}
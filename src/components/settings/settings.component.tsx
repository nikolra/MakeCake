import React, {useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './settings.style.css'
import InputField from "../outlinedd-input-field/input-field.component";
import LabeledField from "../labeled-input/labeled-input.component";
import {toast, ToastContainer} from "react-toastify";
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import axios from "axios";
import Cookies from "js-cookie";
import {deleteToken} from "../../utils/TokenValidation";
import {useNavigate} from "react-router-dom";

interface IOrderProps {
    className?: string,
    username: string
}

export default function SettingsComponent({className, username}: IOrderProps) {

    const [name, setName] = useState(username);
    const [templateName, setTemplateName] = useState('');
    const [smsTemplate, setSmsTemplate] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const navigate = useNavigate();

    const updatePasswordAndName = async () => {
        if (!newPassword)
            toast.error(`Please your new password`);
        else if (!repeatPassword)
            toast.error(`Please repeat your new password`);
        else if (!oldPassword)
            toast.error(`Please enter current password`);
        else if (newPassword !== repeatPassword)
            toast.error(`Passwords do not match`);
        try {
            const payload = {
                PreviousPassword: oldPassword,
                ProposedPassword: newPassword,
                AccessToken: Cookies.get('makecake-accessToken')
            };
            const response = await axios.post("https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/change_password",
                payload,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
            if (response.data.statusCode === 200) {
                toast.success(`Password changed`)
                setNewPassword("");
                setOldPassword("");
                setRepeatPassword("");
            } else {
                toast.error(`Error changing password`)
            }
        } catch (error: any) {
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error('Error fetching recipes:', error);
                toast.error('Error changing password, try again later', {autoClose: 5000});
            }
        }
    }

    const createNewSMSTemplate = async () => {
        try {
            const payload = {
                smsTemplateName: templateName,
                smsTemplateMessage: smsTemplate
            };
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/create_sms_template',
                    payload,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            console.log(JSON.stringify(response));
            console.log(response.data);
        } catch (error: any) {
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error('Error creating SMS template:', error);
                toast.error('Error creating SMS template, try again later', {autoClose: 5000});
            }
        }
    }

    return (
        <div className={`dashboard-widget-container settings-widget ${className}`}>
            <div className="settings-header">
                <div className="settings-header-title-col">
                    <InputField setValueDelegate={setName} label="Name" width={300} value={name}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"}
                                  className={'setting-label-field'}
                                  placeholder='Enter your current password' type="password" required={true}
                                  onChange={(e: any) => {
                                      setOldPassword(e.target.value)
                                  }}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"}
                                  className={'setting-label-field'}
                                  placeholder='Enter your new password password' type="password" required={true}
                                  onChange={(e: any) => {
                                      setNewPassword(e.target.value)
                                  }}/>
                    <LabeledField title='Password' inputClassName={"password-field-input"}
                                  className={'setting-label-field'}
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
                        <InputField setValueDelegate={setTemplateName} label="SMS Template Title" width={300}
                                    value={templateName}/>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': {m: '2vh 0 0 0', width: '100%'},
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
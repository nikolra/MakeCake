import React, {useState} from 'react';
import '../../App.css';
import './create-new-customer-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import validator from 'validator';
import Cookies from "js-cookie";
import {deleteToken} from "../../utils/TokenValidation";

export default function NewCustomerForm() {

    const [customerName, setCustomerName] = useState();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidNumber, setIsValidNumber] = useState(true);
    const [address, setAddress] = useState();
    const navigate = useNavigate();

    async function sendDataToBackend() {
        if (!isValidEmail)
            toast.error(`Please enter a valid email address`);
        else if (!customerName)
            toast.error(`Please enter customer name`);
        else if (!isValidNumber)
            toast.error(`Please enter a valid phone number`);
        else try {
                const payload = {
                    name: customerName,
                    phone_number: phoneNumber,
                    email_address: email,
                    address: address
                };
                console.log('create customer:', payload);
                const response =
                    await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customer',
                        payload,
                        {
                            headers: {
                                "Content-type": "application/json",
                                Authorization: "Bearer " + Cookies.get('makecake-token')
                            }
                        });
                console.log('create customer response status:', response.status);
                console.log('create customer response data:', response.data);
                console.log(JSON.stringify(response));
                console.log(response.data);
                navigate('/customers');
                toast.success(`Created customer ${customerName}, ${email}`, {autoClose: 5000});

            } catch (error: any) {
                console.log(error);
                if (error.response.status === 401 || error.response.status === 403) {
                    deleteToken();
                    navigate('/');
                    toast.error('Login expired please login again', {autoClose: 5000});
                } else {
                    console.error('Error fetching orders:', error);
                    toast.error('Error creatin customer, please try again later', {autoClose: 5000});
                }
            }
    }

    const phoneNumberValidator = (phone: string): boolean => {
        const phoneNumberRegex = /^\+972-\d{9}$/;
        const regex = new RegExp(phoneNumberRegex);
        return regex.test(phone) || phone == "";
    }

    return (
        <div className="dashboard-widget-container new-customer-widget-container">
            <div className="new-customers-header-title-row">
                <div className="new-customers-header-text">
                    <span className="widget-title-text">New Customer</span>
                    <span className="widget-title-text-secondary"> </span>
                </div>
            </div>
            <div className="new-customer-input-fields">
                <div className="customer-input-field">
                    <InputField setValueDelegate={setCustomerName} label="Customer Name" width={500}/>
                </div>

                <div className="customer-input-field">

                    <Box
                        component="div"
                        sx={{
                            width: 500,
                            maxWidth: '100%',
                            m: '0 0 6px 0',
                            border: !isValidNumber ? '1px solid #ff0000' : "",
                            ':focus-within': {
                                border: !isValidNumber ? '1px solid #ff0000' : "",
                                "border-radius": "4px"
                            }
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Phone Number"} variant="outlined"
                                   defaultValue={phoneNumber}
                                   onChange={(e: any) => {
                                       const value = e.target.value
                                       setIsValidNumber(phoneNumberValidator(value));
                                       setPhoneNumber(value)
                                   }}/>
                    </Box>

                </div>

                <div className="customer-input-field">

                    <Box
                        component="div"
                        sx={{
                            width: 500,
                            maxWidth: '100%',
                            m: '0 0 6px 0',
                            border: !isValidEmail ? '1px solid #ff0000' : "",
                            ':focus-within': {
                                border: !isValidEmail ? '1px solid #ff0000' : "",
                                "border-radius": "4px"
                            }
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Email Address"} variant="outlined"
                                   defaultValue={email} type={'email'}
                                   onChange={(e: any) => {
                                       const value = e.target.value
                                       setIsValidEmail(validator.isEmail(value))
                                       setEmail(value)
                                   }}/>
                    </Box>

                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={setAddress} label="Address" width={500}/>
                </div>
            </div>
            <div className="submit-button-container customer-create-button">
                <button className='create-customer-button button button-gradient' onClick={sendDataToBackend}>Create
                </button>
            </div>
            <ToastContainer/>
        </div>
    )
}

import React, { useEffect, useState } from 'react';
import '../../App.css';
import './update-customer-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import {devCustomers} from "../customers/dev-data";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface ICustomerProps {
    email: string;
}

interface ICustomer {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export default function UpdateCustomerForm({email} : ICustomerProps) {

    //TODO: Eden, should find the customer to edit from DB and not from devCustomers
    const [customer, setCustomer] = useState<ICustomer | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isValidNumber, setIsValidNumber] = useState(true);
    const [address, setAddress] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/getallcustomers');
                const customers = response.data;
                const customerData = customers.find((customer: { email: string; }) => customer.email === email);

                if (customerData) {
                    setCustomer(customerData);
                    setCustomerName(customerData.name);
                    setPhoneNumber(customerData.phoneNumber);
                    setAddress(customerData.address);
                }
            } catch (error) {
                console.error(JSON.stringify(error));
            }
        }

        fetchCustomer();
    }, [email]);

    const phoneNumberValidator = (phone: string) :boolean => {
        const phoneNumberRegex = /\b[0245]\d{2}-\d{7}\b/;
        const regex = new RegExp(phoneNumberRegex);
        return regex.test(phone) || phone == "";
    }

    async function sendDataToBackend() {
        console.log("customerName:",customerName);
        if(!customerName)
            toast.error(`Please enter customer name`);
        else if(!isValidNumber)
            toast.error(`Please enter a valid phone number`);
        else try {
            const payload = {
                name: customerName,
                phone_number: phoneNumber,
                email_address: email,
                address: address
            };
            toast.promise(async () => {
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/updatecustomer', payload);
                navigate('/customers');
            }, {
                // @ts-ignore
                loading: 'Loading',
                success: `Updated customer ${customerName}, ${email}`,
                error: `Error updating customer ${customerName}, ${email}`
            });
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }
    if (!customer) {
        return <div>Loading...</div>;
    }
    return (
        <div className="dashboard-widget-container new-customer-widget-container">
            <div className="new-customers-header-title-row">
                <div className="new-customers-header-text">
                    <span className="widget-title-text">Update Customer</span>
                    <span className="widget-title-text-secondary"> </span>
                </div>
            </div>
            <div className="new-customer-input-fields">
                <div className="customer-input-field">
                    <InputField setValueDelegate={setCustomerName} label="Customer Name" width={500} value={customerName} />
                </div>

                <div className="customer-input-field">

                    <Box
                        component="div"
                        sx={{
                            width: 500,
                            maxWidth: '100%',
                            m: '0 0 6px 0',
                            border: !isValidNumber ? '1px solid #ff0000': "",
                            ':focus-within': {
                                border: !isValidNumber ?'1px solid #ff0000' :  "",
                                "border-radius": "4px"
                            }
                        }}
                    >
                        <TextField fullWidth id="outlined-basic" label={"Phone Number"} variant="outlined" defaultValue={phoneNumber} value={phoneNumber}
                                   onChange={(e: any) => {
                                       const value = e.target.value
                                       setIsValidNumber(phoneNumberValidator(value));
                                       setPhoneNumber(value)
                                   }}/>
                    </Box>

                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={() => { }} label="Email Address" width={500} disabled={true} value={email} />
                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={setAddress} label="Address" width={500} value={address} />
                </div>
            </div>
            <div className="submit-button-container customer-create-button">
                <button className='create-customer-button button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
            <ToastContainer/>
        </div>
    );
}

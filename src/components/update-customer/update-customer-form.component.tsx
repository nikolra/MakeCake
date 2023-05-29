import React, {useState} from 'react';
import '../../App.css';
import './update-customer-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import {devCustomers} from "../customers/dev-data";
import axios from "axios";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface ICustomerProps {
    email: string
}

export default function UpdateCustomerForm({email} : ICustomerProps) {

    //TODO: Eden, should find the customer to edit from DB and not from devCustomers
    const customer = devCustomers.find(customer => customer.email === email) || devCustomers[0];
    const [customerName, setCustomerName] = useState(customer.name);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber);
    const [address, setAddress] = useState();
    const navigate = useNavigate();

    async function sendDataToBackend() {
        try {
            const payload = {
                name: customerName,
                phone_number: phoneNumber,
                email_address: email,
                address: address
            };
            toast.promise(async ()=> {
                navigate('/customers');
                const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customer', payload);
                console.log(JSON.stringify(response));
                console.log(response.data);
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
                    <InputField setValueDelegate={setCustomerName} label="Customer Name" width={500} value={customerName}/>
                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={setPhoneNumber} label="Phone Number" width={500} value={phoneNumber}/>
                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={()=>{}} label="Email Address" width={500} disabled={true} value={customer.email}/>
                </div>


                <div className="customer-input-field">
                    <InputField setValueDelegate={setAddress} label="Address" width={500}/>
                </div>
            </div>
            <div className="submit-button-container customer-create-button">
                <button className='create-customer-button button button-gradient' onClick={sendDataToBackend}>Update</button>
            </div>
        </div>
    )
}

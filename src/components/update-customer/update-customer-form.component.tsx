import React, {useState} from 'react';
import '../../App.css';
import './update-customer-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import {devCustomers} from "../customers/dev-data";

interface ICustomerProps {
    email: string
}

export default function UpdateCustomerForm({email} : ICustomerProps) {

    const customer = devCustomers.find(customer => customer.email === email) || devCustomers[0];
    const [customerName, setCustomerName] = useState(customer.name);
    const [phoneNumber, setPhoneNumber] = useState(customer.phoneNumber);

    //  {
    //     name: name,
    //     phoneNumber: phoneNumber,
    //     email: email,
    //     orders: orders
    // }

    function sendDataToBackend() {
        console.log(`Submit clicked`);
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
            </div>
            <div className="submit-button-container customer-create-button">
                <button className='create-customer-button button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}

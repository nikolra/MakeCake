import React, {useState} from 'react';
import '../../App.css';
import './create-new-customer-form.style.css';
import InputField from "../outlinedd-input-field/input-field.component";
import axios from 'axios';


export default function NewCustomerForm() {

    const [customerName, setCustomerName] = useState();
    const [phoneNumber, setPhoneNumber] = useState();
    const [email, setEmail] = useState();


    async function sendDataToBackend() {
        try {
            const payload = {
                name: customerName,
                phone_number: phoneNumber,
                email_address: email
            };

            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customer', payload);
            console.log(JSON.stringify(response));
            console.log(response.data);
        } catch (error) {
            console.error(JSON.stringify(error));
        }
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
                    <InputField setValueDelegate={setCustomerName} label="Customer Name" width={500}/>
                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={setPhoneNumber} label="Phone Number" width={500}/>
                </div>

                <div className="customer-input-field">
                    <InputField setValueDelegate={setEmail} label="Email Address" width={500}/>
                </div>
            </div>
            <div className="submit-button-container customer-create-button">
                <button className='create-customer-button button button-gradient' onClick={sendDataToBackend}>Create</button>
            </div>
        </div>
    )
}

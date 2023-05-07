import React from 'react'
import '../../App.css'
import './customers.style.css'
import EditCustomerForm from "../../components/update-customer/update-customer-form.component";
import {useParams} from "react-router-dom";

export default function EditCustomerPage() {

    const { email } = useParams();
    console.log(`email = ${email}`);
    return (
        <div className="data-container">
            <EditCustomerForm email = {email? email : "1"}/>
        </div>
    )
}

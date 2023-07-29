import React from 'react'
import '../../App.css'
import './customers.style.css'
import NewCustomerForm from "../../components/create-new-customer/create-new-customer-form.component";

export default function AddCustomer() {

    return (

        <div className="data-container">
            <NewCustomerForm/>
        </div>

    )
}

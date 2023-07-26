import React, {useEffect} from 'react'
import '../../App.css'
import './customers.style.css'
import NewCustomerForm from "../../components/create-new-customer/create-new-customer-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function AddCustomer() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    return (
        <div className="data-container">
            <NewCustomerForm/>
        </div>
    )
}

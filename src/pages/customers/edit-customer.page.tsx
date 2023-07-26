import React, {useEffect} from 'react'
import '../../App.css'
import './customers.style.css'
import EditCustomerForm from "../../components/update-customer/update-customer-form.component";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";

export default function EditCustomerPage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    const { email } = useParams();
    console.log(`email = ${email}`);
    return (
        <div className="data-container">
            <EditCustomerForm email = {email? email : "1"}/>
        </div>
    )
}

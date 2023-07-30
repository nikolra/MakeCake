import React, {useEffect, useState} from 'react'
import '../../App.css'
import './customers.style.css'
import NewCustomerForm from "../../components/create-new-customer/create-new-customer-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function AddCustomer() {

    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        const func = async () => {
            await validateToken(token, navigate);
            setIsTokenValidated(true);
        }
        func();
    }, []);

    return (

        <div className="data-container">
            {isTokenValidated &&
                <NewCustomerForm/>
            }
        </div>

    )
}

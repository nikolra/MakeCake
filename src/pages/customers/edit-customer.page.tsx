import React, {useEffect, useState} from 'react'
import '../../App.css'
import './customers.style.css'
import EditCustomerForm from "../../components/update-customer/update-customer-form.component";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";


export default function EditCustomerPage() {

    const {email} = useParams();
    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        validateToken(token, navigate);
        setIsTokenValidated(true);

    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <EditCustomerForm email={email ? email : "1"}/>
            }
        </div>

    )
}

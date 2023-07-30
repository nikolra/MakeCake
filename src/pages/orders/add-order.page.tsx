import React, {useEffect, useState} from 'react'
import '../../App.css'
import './orders.style.css'
import NewOrderForm from "../../components/create-new-order/create-new-order-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function AddOrder() {

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
            { isTokenValidated &&
                <NewOrderForm/>
            }
        </div>
    )
}

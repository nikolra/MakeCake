import React, {useEffect, useState} from 'react'
import AllOrders from '../../components/orders/orders.component'
import '../../App.css'
import './orders.style.css'
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Orders() {

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
                <AllOrders className="all-orders-container" header="Orders" description="All orders"/>
            }
        </div>
    )
}

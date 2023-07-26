import React, {useEffect} from 'react'
import AllOrders from '../../components/orders/orders.component'
import '../../App.css'
import './orders.style.css'
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Orders() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    return (
        <div className="data-container">
            <AllOrders className="all-orders-container" header="Orders" description="All orders"/>
        </div>
    )
}

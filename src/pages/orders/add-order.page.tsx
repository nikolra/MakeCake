import React, {useEffect} from 'react'
import '../../App.css'
import './orders.style.css'
import NewOrderForm from "../../components/create-new-order/create-new-order-form.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function AddOrder() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    return (
        <div className="data-container">
            <NewOrderForm/>
        </div>
    )
}

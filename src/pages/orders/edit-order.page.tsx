import React, {useEffect} from 'react'
import '../../App.css'
import './orders.style.css'
import {useNavigate, useParams} from "react-router-dom";
import EditOrderForm from "../../components/update-order/update-order-form.component";
import Cookies from "js-cookie";

export default function EditOrderPage() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

    const { id } = useParams();
    console.log(`id = ${id}`);
    return (
        <div className="data-container">
            <EditOrderForm id = {id? id : "1"}/>
        </div>
    )
}

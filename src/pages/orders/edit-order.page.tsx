import React from 'react'
import '../../App.css'
import './orders.style.css'
import {useParams} from "react-router-dom";
import EditOrderForm from "../../components/update-order/update-order-form.component";

export default function EditOrderPage() {

    const { id } = useParams();
    console.log(`id = ${id}`);
    return (
        <div className="data-container">
            <EditOrderForm id = {id? id : "1"}/>
        </div>
    )
}

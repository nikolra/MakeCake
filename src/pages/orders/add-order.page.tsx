import React from 'react'
import '../../App.css'
import './orders.style.css'
import NewOrderForm from "../../components/create-new-order/create-new-order-form.component";

export default function AddOrder() {

    return (
        <div className="data-container">
            <NewOrderForm/>
        </div>
    )
}

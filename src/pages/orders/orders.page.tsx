import React from 'react'
import AllOrders from '../../components/orders/orders.component'
import '../../App.css'
import './orders.style.css'

export default function Orders() {
    return (
        <div className="data-container">
            <AllOrders className="all-orders-container" header="Orders" description="All orders"/>
        </div>
    )
}

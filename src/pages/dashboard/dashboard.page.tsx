import React from 'react'

import './dashboard.style.css'
import Income from "../../components/dashboard-widgets/income/income.component";
import Orders from "../../components/orders/orders.component";
import WeekOrders from "../../components/dashboard-widgets/best-customers/best-customers.component";
import {ToastContainer} from "react-toastify";

export default function Dashboard() {
  return (
    <div className="data-container dashboard-container">
        <div className="dashboard-content">
            <Orders className="today-orders" header="Today orders" description="Orders for today" isDashboard={true}/>
            <WeekOrders/>
            <Income/>
            <ToastContainer/>
        </div>
    </div>
  )
}

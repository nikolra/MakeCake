import React, {useState} from 'react'
import './best-customers.style.css';
import '../widgets.style.css';
import {ToastContainer} from "react-toastify";
import BestCustomersDelegate from "./best-customers-delegate.component";

export default function WeekOrders() {
    const [customers, setCustomers] = useState([]);
    //TODO: Tomer - load best customers date to customers on page loading
    return (
        <div className="calendar-container dashboard-widget-container">
            <div className="best-customers-header">
                <div className="best-customers-header-title-row">
                    <div className="best-customers-header-text">
                        <span className="widget-title-text">Best Customers</span>
                        <span className="widget-title-text-secondary">Top 5 customers by number of orders</span>
                    </div>
                </div>
                <div className="best-customers-header-orders-list-title">
                    <div className="best-customers-header-orders-list-title-item">
                        <span>Number</span>{/*TODO: Tomer - this represent the location of the customer on the list. 1 -> the best*/}
                    </div>
                    <div className="best-customers-header-orders-list-title-item">
                        <span>Name</span>
                    </div>
                    <div className="best-customers-header-orders-list-title-item">
                        <span>#Orders</span>
                    </div>
                </div>
            </div>
            <div className="best-customers-list-container">
                <div className="best-customers-list">
                    {customers.map((customer) => {
                        // @ts-ignore TODO: Tomer - remove this line after integration completed
                        return <BestCustomersDelegate key={customer.number} data={customer}/>;
                    })}
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
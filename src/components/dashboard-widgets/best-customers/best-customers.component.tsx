import React, {useEffect, useState} from 'react'
import './best-customers.style.css';
import '../widgets.style.css';
import {ToastContainer} from "react-toastify";
import BestCustomersDelegate from "./best-customers-delegate.component";
import axios from 'axios';
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const {promisify} = require('util');

type Customer = {
    number: number;
    orders: number;
    name: string;
};

export default function WeekOrders() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token')) {
            navigate("/");
            return;
        }
        fetchTopCustomers();
    }, []);

    async function fetchTopCustomers() {
        try {
            const response =
                await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/top_buyers',
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    },
                );
            const responseData = JSON.parse(response.data.body);
            console.log(responseData)
            const filteredData: Customer[] = responseData.map((item: any, index: number) => ({
                number: index + 1,
                orders: item.count,
                name: item.email
            }));
            setCustomers(filteredData);
        } catch {

        }
    }

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
                        <span>Number</span>
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
                    {customers.map((customer: any) => {
                        return <BestCustomersDelegate key={customer.number} data={customer}/>;
                    })}
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}
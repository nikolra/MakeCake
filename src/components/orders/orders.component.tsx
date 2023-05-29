import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './orders.style.css'
import OrderDelegate from './order-delegate/order-delegate.component'
import {devOrders} from "./dev-data";
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";
import {ToastContainer} from "react-toastify";

interface IOrderProps{
    className: string,
    header: string,
    description: string
}

export default function Orders({className, header, description}: IOrderProps) {

    //TODO: Tomer should use ingredients from DB and not devOrders
    const [orders, setOrders] = useState(devOrders);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [searchString, setSearchString] = useState('');

    useEffect( () => {
        const filtered = orders.filter((order) => {
            const name = order.customer.name.toLowerCase();
            console.log(name, searchString, name.includes(searchString))
            return name.includes(searchString);
        })
        setFilteredOrders(filtered)
    }, [orders, searchString])

    return (
        <div className= {`dashboard-widget-container orders-widget ${className}`}>
            <div className="orders-header">
                <div className="orders-header-title-row">
                    <div className="orders-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="orders-header-find-container">
                        <SearchField placeholder="Find" onChangeHandler={
                            (event: any) => {
                                setSearchString(event.target.value.toLowerCase())
                            }
                        }/>
                    </div>
                </div>

                <div className="orders-header-orders-list-title">
                    <div className="orders-header-orders-list-title-item">
                        <span>Order</span>
                    </div>
                    <div className="orders-header-orders-list-title-item">
                        <span>Customer</span>
                    </div>
                    <div className="orders-header-orders-list-title-item">
                        <span>Total</span>
                    </div>
                </div>
            </div>
            <div className="orders-list-container">
                <div className="orders-list">
                    {
                        filteredOrders.map((order) => {
                            return <OrderDelegate key={order.id} data={order} />
                        })
                    }
                </div>
            </div>
            <NavigationButtonComponent to="/orders/new" text="Add Order"/>
            <ToastContainer/>
        </div>
    )
}
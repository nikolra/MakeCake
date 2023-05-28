import React, {useState} from 'react';

import './customer-delegate.style.css'
import {NavLink} from "react-router-dom";

interface ICustomerProps{
    data: any
}

function CustomerDelegate(props: ICustomerProps) {

    const [isOpened, setOpened] = useState(false)
    const {name, phoneNumber, email, orders, address} = props.data;

    return (
        <div className={
            `customer-delegate-main-container customer-delegate-text customer-delegate-opened ${isOpened ? "all-customers-delegate-opened" : ""}`
        }>
            <div className="customer-delegate-container">
                <div className="customer-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="customer-delegate-table-container">
                    <span>{phoneNumber}</span>
                </div>
                <div className="customer-delegate-table-container">
                    <span>{email}</span>
                </div>
                <div className="customer-delegate-table-container">
                    <span>{address? address : ""}</span>
                </div>
                <div className="all-customers-delegate-table-container align-right">
                    <button className="expand-button">
                        <NavLink to={`/customer/edit/${email}`} className={`link active`}>Edit</NavLink>
                    </button>

                    <button className="expand-button" onClick={
                        () => {
                            //TODO: EDEN - implement customer delete. should be with a toaster like in create
                        }
                    }>
                        Delete
                    </button>
                    <button className="expand-button" onClick={
                        () => {
                            setOpened(!isOpened);
                        }
                    }>
                        {!isOpened ? "Show" : "Hide"}
                    </button>
                </div>
            </div>

            {isOpened &&
            <div className="all-customers-delegate-customer-container op-50">

                <div className="all-customers-delegate-customer-title">
                    <div className="all-customers-delegate-customer-title-item">
                        <span>Order ID</span>
                    </div>
                    <div className="all-customers-delegate-customer-title-item">
                        <span>Order Due Date</span>
                    </div>
                    <div className="all-customers-delegate-customer-title-item">
                        <span>Order Price</span>
                    </div>

                </div>
                {
                    orders.map((order: any) => {
                        return(
                            <div className="all-customers-delegate-customer-title-value">
                                <div className="all-customers-delegate-customer-title-item">
                                    <span>{order.id}</span>
                                </div>
                                <div className="all-customers-delegate-customer-title-item">
                                    <span>{order.dueDate}</span>
                                </div>
                                <div className="all-customers-delegate-customer-title-item">
                                    <span>{order.totalCost}₪</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            }
        </div>
    );
}

export default CustomerDelegate;
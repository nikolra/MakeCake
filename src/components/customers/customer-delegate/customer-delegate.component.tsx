import React, {useState} from 'react';

import './customer-delegate.style.css'
import {NavLink} from "react-router-dom";
import PopUp from '../../popup/popup.component'
import 'reactjs-popup/dist/index.css';

interface ICustomerProps {
    data: any,
    deleteDelegate: Function
}

function CustomerDelegate({data, deleteDelegate}: ICustomerProps) {

    const [isOpened, setOpened] = useState(false);
    const [templates, setTemplates] = useState(["sms1", "sms2"]);
    const {name, phoneNumber, email, orders, address} = data;

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
                    <span>{address ? address : ""}</span>
                </div>
                <div className="all-customers-delegate-table-container align-right">
                    <button className="expand-button">
                        <NavLink to={`/customers/edit/${email}`} className={`link active`}>Edit</NavLink>
                    </button>
                    <button className="expand-button" onClick={
                        async () => {
                            await deleteDelegate(email);
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
                            return (
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
                                    <PopUp buttonText="SMS" dropdownValues={templates} order={order} customerName={name}
                                           customerPhoneNumber={phoneNumber} customerEmail={email} customerAddress={address}/>
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
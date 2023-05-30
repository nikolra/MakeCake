import React, { useState } from 'react';
import './customer-delegate.style.css';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

interface ICustomerProps {
    data: any;
    fetchCustomers: () => void;
}

function CustomerDelegate(props: ICustomerProps) {
    const navigate = useNavigate();
    const [isOpened, setOpened] = useState(false);
    const { name, phoneNumber, email, orders, address } = props.data;
    async function deleteCustomer() {
        console.log('Deleting customer:', props.data);
        try {
            toast.promise(async () => {
                navigate('/customers');
                console.log('Deleting customer:', email);
                const response = await axios.delete('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/deletecustomer', { data: { email }, });
                console.log('Delete customer response status:', response.status);
                console.log('Delete customer response data:', response.data);
                props.fetchCustomers();
            }, {
                // @ts-ignore
                loading: 'Loading',
                success: `Delete customer ${email}`,
                error: `Error deleting customer ${email}`
            });
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }

    // Add the call to handleFetchCustomers after successful delete
    async function handleDeleteCustomer() {
        await deleteCustomer();
        props.fetchCustomers(); // Fetch the updated customer list
    }
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
                        <NavLink to={`/customer/edit/${email}`} className={`link active`}>Edit</NavLink>
                    </button>

                    <button className="expand-button" onClick={() => handleDeleteCustomer()}>
                        Delete
                    </button>
                    <button className="expand-button" onClick={() => { setOpened(!isOpened); }}>
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
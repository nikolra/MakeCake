import React, { useEffect, useState } from 'react';
import '../dashboard-widgets/widgets.style.css';
import './customers.style.css';
import CustomerDelegate from './customer-delegate/customer-delegate.component';

import SearchField from '../search-field/search-field.component';
import NavigationButtonComponent from '../navigation-button/navigation-button.component';
import axios from 'axios';
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";

interface ICustomerProps {
    className: string;
    header: string;
    description: string;
}

interface ICustomer {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    orders: {
        id: string;
        dueDate: number;
        totalCost: number;
    }[];
}

export default function Customers({ className, header, description }: ICustomerProps) {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerDetails();
    }, []);

    const deleteCustomer = async (customerEmail:string) => {
        // console.log('Deleting customer:', customerEmail);
        // const payload = {
        //     email_address: customerEmail
        // };
        // toast.promise(async () => {
        //     navigate('/customers');
        //     //console.log('Deleting customer:', customerEmail);
        //     // @ts-ignore
        //     const response = await axios.delete('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/deletecustomer',payload);
        //     const response2 = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customer', payload);
        //
        //     console.log('Delete customer response status:', response.status);
        //     console.log('Delete customer response data:', response.data);
        //
        // }, {
        //     // @ts-ignore
        //     loading: 'Loading',
        //     success: `Delete customer ${customerEmail}`,
        //     error: `Error deleting customer ${customerEmail}`
        // });
        // console.log(customers);
        // const arr= customers.filter(customer=>customer.email!==customerEmail);
        // //TODO: EDEN - implement customer delete. should be with a toaster like in create
        // // You should use setCustomers method to update the new customers list
        // //await fetchCustomerDetails();
        // console.log(arr);
        // setCustomers(arr);
    }

    const fetchCustomerDetails = async () => {
        try {
            const response = await axios.get('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/customers');
            const data = response.data;

            const formattedCustomers = data.map((customer: any) => {
                return {
                    name: customer.name,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email,
                    address: customer.address,
                    orders: customer.orders.map((order: any) => {
                        return {
                            id: order.id,
                            dueDate: order.dueDate,
                            totalCost: order.totalCost,
                        };
                    }),
                };
            });
            setCustomers(formattedCustomers);
            setFilteredCustomers(formattedCustomers);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };

    useEffect(() => {
        const filtered = customers.filter((customer) => {
            const name = customer.name.toLowerCase();
            return name.includes(searchString);
        });
        setFilteredCustomers(filtered);
    }, [customers, searchString]);

    return (
        <div className={`dashboard-widget-container customers-widget ${className}`}>
            <div className="customers-header">
                <div className="customers-header-title-row">
                    <div className="customers-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="customers-header-find-container">
                        <SearchField
                            placeholder="Find"
                            onChangeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchString(event.target.value.toLowerCase());
                            }}
                        />
                    </div>
                </div>

                <div className="customers-header-customers-list-title">
                    <div className="customers-header-customers-list-title-item">
                        <span>Name</span>
                    </div>
                    <div className="customers-header-customers-list-title-item">
                        <span>Phone Number</span>
                    </div>
                    <div className="customers-header-customers-list-title-item">
                        <span>Email Address</span>
                    </div>
                    <div className="customers-header-customers-list-title-item">
                        <span>Address</span>
                    </div>
                </div>
            </div>
            <div className="customers-list-container">
                <div className="customers-list">
                    {filteredCustomers.map((customer) => {
                        return <CustomerDelegate key={customer.email} data={customer} deleteDelegate={deleteCustomer}/>;
                    })}
                </div>
            </div>
            <NavigationButtonComponent to="/customers/new" text="Add Customer" />
            <ToastContainer/>
        </div>
    );
}
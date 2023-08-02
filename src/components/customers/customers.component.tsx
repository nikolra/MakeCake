import React, {useEffect, useState} from 'react';
import '../dashboard-widgets/widgets.style.css';
import './customers.style.css';
import CustomerDelegate from './customer-delegate/customer-delegate.component';

import SearchField from '../search-field/search-field.component';
import NavigationButtonComponent from '../navigation-button/navigation-button.component';
import axios from 'axios';
import {toast, ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {deleteToken} from "../../utils/TokenValidation";

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

export default function Customers({className, header, description}: ICustomerProps) {
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
    const [templates, setTemplates] = useState<string[]>([]);
    const [searchString, setSearchString] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const func = async () => {
            await fetchCustomerDetails();
            await fetchSMSTemplateNames();
        }
        func();
    }, []);

    useEffect(() => {
        const filtered = customers.filter((customer) => {
            const name = customer.name.toLowerCase();
            return name.includes(searchString);
        });
        setFilteredCustomers(filtered);
    }, [customers, searchString]);
    const fetchSMSTemplateNames = async () => {
        try {
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/get_all_sms_templates',
                    {}, {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            const data = response.data;
            console.log(data);
            setTemplates(data);
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error('Error getting all SMS template names', error);
                toast.error('Error getting all SMS template names, please try again later', {autoClose: 5000});
            }
        }
    }

    const deleteCustomer = async (customerEmail: string) => {
        console.log('Deleting customer:', customerEmail);
        const payload = {
            email_address: customerEmail
        };
        try {
            console.log('Deleting customer:', customerEmail);
            const response = await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/delete-customer',
                payload,
                {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: "Bearer " + Cookies.get('makecake-token')
                    }
                });
            console.log('Delete customer response status:', response.status);
            console.log('Delete customer response data:', response.data);
            const updatedCustomers = customers.filter(customer => customer.email !== customerEmail);
            setCustomers(updatedCustomers);
            navigate('/customers');
        } catch (error: any) {
            console.log(error);
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error(`Error deleting customer ${customerEmail}`, error);
                toast.error(`Error deleting customer ${customerEmail}, please try again later`, {autoClose: 5000});
            }
        }
    }

    const fetchCustomerDetails = async () => {
        try {
            const payload = {};
            const response =
                await axios.post('https://5wcgnzy0bg.execute-api.us-east-1.amazonaws.com/dev/all-customers',
                    payload,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Authorization: "Bearer " + Cookies.get('makecake-token')
                        }
                    });
            console.log(response);
            console.log('formattedCustomers:', response.data);
            setFilteredCustomers(response.data);
        } catch (error: any) {
            console.log('fetch customers error', error);
            if (error.response.status === 401 || error.response.status === 403) {
                deleteToken();
                navigate('/');
                toast.error('Login expired please login again', {autoClose: 5000});
            } else {
                console.error(`Error fetching customers`, error);
                toast.error(`Error fetching customers, please try again later`, {autoClose: 5000});
            }
        }
    };

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
                        return <CustomerDelegate key={customer.email} data={customer} deleteDelegate={deleteCustomer}
                                                 templateNames={templates}/>;
                    })}
                </div>
            </div>
            <NavigationButtonComponent to="/customers/new" text="Add Customer" fontClassName="add-customer-button"
                                       spanClass={'add-customer-span'}/>
            <ToastContainer/>
        </div>
    );
}
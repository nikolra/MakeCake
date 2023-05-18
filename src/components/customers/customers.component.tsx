import React, {useEffect, useState} from 'react'
import '../dashboard-widgets/widgets.style.css'
import './customers.style.css'
import CustomerDelegate from './customer-delegate/customer-delegate.component'
import {devCustomers} from "./dev-data";
import SearchField from "../search-field/search-field.component";
import NavigationButtonComponent from "../navigation-button/navigation-button.component";

interface ICustomerProps {
    className: string,
    header: string,
    description: string
}

export default function Customers({className, header, description}: ICustomerProps) {

    const [customers, setCustomers] = useState(devCustomers);
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const [searchString, setSearchString] = useState('');

    useEffect(() => {
        const filtered = customers.filter((customer) => {
            const name = customer.name.toLowerCase();
            console.log(name, searchString, name.includes(searchString))
            return name.includes(searchString);
        })
        setFilteredCustomers(filtered)
    }, [customers, searchString])

    return (
        <div className={`dashboard-widget-container customers-widget ${className}`}>
            <div className="customers-header">
                <div className="customers-header-title-row">
                    <div className="customers-header-text">
                        <span className="widget-title-text">{header}</span>
                        <span className="widget-title-text-secondary">{description}</span>
                    </div>
                    <div className="customers-header-find-container">
                        <SearchField placeholder="Find" onChangeHandler={
                            (event: any) => {
                                setSearchString(event.target.value.toLowerCase())
                            }
                        }/>
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
                    {
                        filteredCustomers.map((customer) => {
                            return <CustomerDelegate key={customer.name} data={customer}/>
                        })
                    }
                </div>
            </div>
            <NavigationButtonComponent to="/customers/new" text="Add Customer"/>
        </div>
    )
}
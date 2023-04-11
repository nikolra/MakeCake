import React from 'react';

import './customer-delegate.style.css'

interface ICustomerProps{
    data: any
}

function CustomerDelegate(props: ICustomerProps) {
    const {name, phoneNumber, email} = props.data;

    return (
        <div className={
            `customer-delegate-main-container customer-delegate-text customer-delegate-opened`
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

            </div>

        </div>
    );
}

export default CustomerDelegate;
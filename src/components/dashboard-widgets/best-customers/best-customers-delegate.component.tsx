import React from 'react';

import './best-customers.style.css'

interface IOrderProps {
    data: any,
}

function BestCustomersDelegate(props: IOrderProps) {
    const {name, numberOfOrders, number} = props.data;

    return (
        <div className='best-customers-delegate-main-container best-customers-delegate-text'>
            <div className="best-customers-delegate-container">
                <div className="best-customers-delegate-table-container">
                    <span>{number}</span>
                </div>
                <div className="best-customers-delegate-table-container">
                    <span>{name}</span>
                </div>
                <div className="best-customers-delegate-table-container">
                    <span>{numberOfOrders}</span>
                </div>
            </div>
        </div>
    );
}

export default BestCustomersDelegate;
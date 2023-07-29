import React from 'react'
import AllCustomers from "../../components/customers/customers.component";

export default function Customers() {

    return (
        <div className="data-container">
            <AllCustomers className="all-orders-container" header="Customers" description="All Customers"/>
        </div>
    )
}

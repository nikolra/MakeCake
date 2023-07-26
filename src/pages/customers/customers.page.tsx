import React, {useEffect} from 'react'
import AllCustomers from "../../components/customers/customers.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function Customers() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

  return (
      <div className="data-container">
        <AllCustomers className="all-orders-container" header="Customers" description="All Customers"/>
      </div>
  )
}

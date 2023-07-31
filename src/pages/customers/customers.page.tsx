import React, {useEffect, useState} from 'react'
import AllCustomers from "../../components/customers/customers.component";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Customers() {

    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        validateToken(token, navigate);
        setIsTokenValidated(true);
    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <AllCustomers className="all-orders-container" header="Customers" description="All Customers"/>
            }
        </div>
    )
}

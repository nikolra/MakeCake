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
        const func = async () => {
            await validateToken(token, navigate);
            setIsTokenValidated(true);
        }
        func();
    }, []);

    return (
        <div className="data-container">
            {isTokenValidated &&
                <AllCustomers className="all-orders-container" header="Customers" description="All Customers"/>
            }
        </div>
    )
}

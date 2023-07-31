import React, {useEffect, useState} from 'react'
import './dashboard.style.css'
import Income from "../../components/dashboard-widgets/income/income.component";
import Orders from "../../components/orders/orders.component";
import WeekOrders from "../../components/dashboard-widgets/best-customers/best-customers.component";
import {ToastContainer} from "react-toastify";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function Dashboard() {

    const [isTokenValidated, setIsTokenValidated] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        validateToken(token, navigate);
        setIsTokenValidated(true);
    }, []);

    return (
        <div className="data-container dashboard-container">
            {isTokenValidated &&
                <div className="dashboard-content">
                    <Orders className="today-orders" header="Today orders" description="Orders for today"
                            isDashboard={true}/>
                    <WeekOrders/>
                    <Income/>
                </div>
            }
            <ToastContainer/>
        </div>
    )
}

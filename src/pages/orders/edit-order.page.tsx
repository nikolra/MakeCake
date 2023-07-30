import React, {useEffect, useState} from 'react'
import '../../App.css'
import './orders.style.css'
import {useNavigate, useParams} from "react-router-dom";
import EditOrderForm from "../../components/update-order/update-order-form.component";
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function EditOrderPage() {

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

    const {id} = useParams();
    console.log(`id = ${id}`);
    return (
        <div className="data-container">
            { isTokenValidated &&
                <EditOrderForm id={id ? id : "1"}/>
            }
        </div>
    )
}

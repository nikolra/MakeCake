import React, {useEffect, useState} from 'react'
import {Outlet, useNavigate} from 'react-router-dom';
import DashboardPanel from '../../components/dashboard-panel/dashboard-panel.component'
import Cookies from "js-cookie";
import {validateToken} from "../../utils/TokenValidation";

export default function DashboardLayout() {

    const [username, setName] = useState('');
    const [isTokenValidated, setIsTokenValidated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('makecake-token');
        const func = async () => {
            const name = await validateToken(token, navigate);
            setIsTokenValidated(true);
            setName(name? name : "");
        }
        func();
    }, []);

    return (
        <div>
            {isTokenValidated &&
                <div className="pages">
                    <DashboardPanel username={username}/>
                    <Outlet/>
                </div>
            }
        </div>
    )
}

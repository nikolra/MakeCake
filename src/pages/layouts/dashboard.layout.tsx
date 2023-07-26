import React, {useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom';
import DashboardPanel from '../../components/dashboard-panel/dashboard-panel.component'
import Cookies from "js-cookie";

export default function DashboardLayout() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get('makecake-token'))
            navigate("/");
    }, []);

  return (
    <div className="pages">
        <DashboardPanel />
        <Outlet/>
    </div>
  )
}

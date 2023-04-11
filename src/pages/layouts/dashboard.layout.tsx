import React, {useEffect} from 'react'
import {Outlet} from 'react-router-dom';
import DashboardPanel from '../../components/dashboard-panel/dashboard-panel.component'

export default function DashboardLayout() {
    useEffect(() => {

    })
  return (
    <div className="pages">
        <DashboardPanel />
        <Outlet/>
    </div>
  )
}

import React, {useState} from 'react'
import './dashboard-panel.style.css'
import DashboardLink from '../dashboard-link/dashboard-link.component'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import User from '../user/user.component'

export default function DashboardPanel() {
  const [currentIndex, setIndex] = useState(0);

  return (
    <div className="dashboard-side-panel">
      <div className='user-section-container'>
        <User/>
      </div>
      <div className="navigation-container">
        <DashboardLink to="/dashboard" text="Dashboard" icon={solid('chart-simple')} />
        <DashboardLink to="/orders" text="Orders" icon={solid('receipt')} />
        <DashboardLink to="/customers" text="Customers" icon={solid('address-book')} />
        <DashboardLink to="/recipes" text="Recipes" icon={solid('book')} />
        <DashboardLink to="/ingredients" text="Ingredients" icon={solid('mortar-pestle')} />
        <DashboardLink to="/settings" text="Settings" icon={solid('gear')} />
      </div>  
      <div className='logout-container'>
        <DashboardLink to="/" text="Log out" icon={solid('right-from-bracket')} />
      </div>
    </div>
  )
}

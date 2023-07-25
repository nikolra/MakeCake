import React, {useState} from 'react'
import './dashboard-panel.style.css'
import DashboardLink from '../dashboard-link/dashboard-link.component'
import {solid} from '@fortawesome/fontawesome-svg-core/import.macro'
import User from '../user/user.component'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

export default function DashboardPanel() {
    const [currentIndex, setIndex] = useState(0);
    const navigate = useNavigate();

    return (
        <div className="dashboard-side-panel">
            <div className='user-section-container'>
                <User/>
            </div>
            <div className="navigation-container">
                <DashboardLink to="/dashboard" text="Dashboard" icon={solid('chart-simple')}/>
                <DashboardLink to="/orders" text="Orders" icon={solid('receipt')}/>
                <DashboardLink to="/customers" text="Customers" icon={solid('address-book')}/>
                <DashboardLink to="/recipes" text="Recipes" icon={solid('book')}/>
                <DashboardLink to="/ingredients" text="Ingredients" icon={solid('mortar-pestle')}/>
                <DashboardLink to="/settings" text="Settings" icon={solid('gear')}/>
            </div>
            <div className='logout-container'>
                {/*<DashboardLink to="/" text="Log out"/>*/}
                <div className="container">
                    <FontAwesomeIcon icon={solid('right-from-bracket')} className={'icon active'}/>
                    <NavLink to={"/"} className={'link active'} onClick={() => {
                        navigate("/");
                        Cookies.remove('makecake-token');
                    }}>
                        <span className="text">{"Log out"}</span>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

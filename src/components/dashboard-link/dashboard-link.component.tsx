import React, {useState} from 'react'
import './dashboard-link.style.css';
import {NavLink} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

interface IButtonProps {
    text?: string
    to: string
    icon: IconProp
}

DashboardLink.defaultProps = {
    text: '',
    to: "/",
    icon: 'chart-simple'
}

export default function DashboardLink(props: IButtonProps) {
    const [active, setActive] = useState(false)
    return (
        <div className="container">
            <FontAwesomeIcon icon={props.icon} className={active ? 'icon active' : 'icon inactive'}/>
            <NavLink to={props.to} className={({isActive, isPending}): string => {
                setActive(isActive)
                return isActive ? 'link active' : 'link inactive'
            }}>
                <span className="text">{props.text}</span>
            </NavLink>
        </div>
    )
}

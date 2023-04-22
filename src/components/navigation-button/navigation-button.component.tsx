import React from 'react'
import {NavLink} from "react-router-dom";
import './navigation-button.style.css'

interface IButtonProps {
    text?: string,
    className?:string,
    to: string
}

export default function NavigationButtonComponent(props: IButtonProps) {

    return (
        <div className={`${props.className} nav-button-container`}>
            <NavLink to={props.to}  className={` link active add-item-button`}>
                <span className="button-text">{props.text}</span>
            </NavLink>
        </div>
    )
}
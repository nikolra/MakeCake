import React from 'react'
import {NavLink} from "react-router-dom";
import './navigation-button.style.css'

interface IButtonProps {
    text?: string,
    className?:string,
    to: string,
    fontClassName?:string
}

export default function NavigationButtonComponent(props: IButtonProps) {

    return (
        <div className={`${props?.className} nav-button-container`} onClick={() => console.log(props)}>
            <NavLink to={props.to}  className={`link active add-item-button ${props?.fontClassName}`}>
                <span className="button-text">{props.text}</span>
            </NavLink>
        </div>
    )
}
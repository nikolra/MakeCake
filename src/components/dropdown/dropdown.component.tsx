import React, {useState} from 'react';

import './dropdown.style.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

interface IProps{
    model: any,
    onChanged: any
}

function Dropdown(props: IProps) {
    const [text, setText] = useState(props.model[0])

    const clicked = (event: any) => {
        setText(event.target.text);
        props.onChanged(event.target.text);
    }

    return (
        <div className="dropdown">
            <button className="dropbtn">
                <span>{text}</span>
                <FontAwesomeIcon icon={solid('caret-down')} />
            </button>
            <div className="dropdown-content">
                {
                    props.model.map((content: string) =>{
                        return (
                            <a key={content} onClick={ clicked }>{content}</a>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Dropdown;
import React, { useState } from 'react'
import './checkbox.style.css'

interface ICheckBoxProps{
    text?: string
}

CheckBox.defaultProps = {
    text: ''
}

export default function CheckBox(props: ICheckBoxProps) {
    const [checked, setChecked] = useState(false)

  return (
    <div className="checkbox">
        <a className="checkbox-area" onClick={ () => { setChecked(!checked) } }>
        { checked ? <div className="checkbox-dot"/> : null }
        </a>
        { props.text ? <span className="checkbox-text">{props.text}</span> : null }
    </div>
  )
}

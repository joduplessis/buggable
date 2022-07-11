import React from 'react'
import './button.component.css'

export const ButtonComponent = (props) => {
    return (
        <div className="screenshotter__button-component">
            <button className="screenshotter__button-component-button" onClick={props.onClick}>
                {props.children}
            </button>
        </div>
    )
}

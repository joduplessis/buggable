import React, { useState } from 'react'
import './input.component.css'

export const InputComponent = (props) => {
    return (
        <div className="screenshotter__input-component">
            <input
                placeholder={props.placeholder}
                value={props.value}
                className="screenshotter__input-component__field"
                onChange={(e) => props.onChange(e.target.value)}
                type="text"
            />
        </div>
    )
}

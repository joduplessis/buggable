import React from 'react'
import './crosshair.component.css'

export function CrosshairComponent(props) {
    const {
        position: { x, y },
        active,
    } = props
    if (!active) return null
    return <div className="crosshair-component" style={{ top: y, left: x }} />
}

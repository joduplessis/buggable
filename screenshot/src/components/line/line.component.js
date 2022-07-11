import React from 'react'
import './line.component.css'

export function LineComponent({ points, color, onDelete }) {
    const pathData =
        'M ' +
        points
            .map((p) => {
                return `${p.x} ${p.y}`
            })
            .join(' L ')

    return (
        <path
            className="line-component"
            d={pathData}
            stroke={color}
            fill="none"
            strokeWidth={5}
            onClick={onDelete}
            strokeLinejoin="round"
            strokeLinecap="round"
        />
    )
}

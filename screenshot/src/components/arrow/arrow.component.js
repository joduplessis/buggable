import React, { useEffect, useState } from 'react'
import './arrow.component.css'
import { getArrow } from 'perfect-arrows'

export function ArrowComponent(props) {
    const [arrow, setArrow] = useState(null)

    useEffect(() => {
        const { sx, sy, ex, ey } = props
        setArrow(
            getArrow(sx, sy, ex, ey, {
                bow: 0,
                stretch: 0.1,
                stretchMin: 0,
                stretchMax: 420,
                padStart: 0,
                padEnd: 0,
                flip: false,
                straights: true,
            })
        )
    }, [props.sx, props.sy, props.ex, props.ey])

    if (!arrow) return null

    const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow
    const endAngleAsDegrees = ae * (180 / Math.PI)

    return (
        <g>
            <path
                d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
                fill="none"
                stroke={props.color}
                strokeWidth={5}
                onClick={props.onDelete}
            />
            <polygon
                onClick={props.onDelete}
                style={{ strokeLinejoin: 'round' }}
                stroke={props.color}
                fill={props.color}
                strokeWidth={5}
                points="0,-6 12,0, 0,6"
                transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
            />
        </g>
    )
}

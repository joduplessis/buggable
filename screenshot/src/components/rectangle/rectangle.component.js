import React, { useState } from 'react'
import { ResizableComponent } from '../resizable/resizable.component'
import './rectangle.component.css'

export function RectangleComponent(props) {
    const [over, setOver] = useState(false)
    const [position, setPosition] = useState({
        active: false,
        offset: {},
    })
    const beingDragged = !!props.originX || !!props.originY

    const handlePointerDown = (e) => {
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        el.setPointerCapture(e.pointerId)
        setPosition({
            active: true,
            offset: {
                x,
                y,
            },
        })
    }

    const handlePointerMove = (e) => {
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        if (position.active) {
            props.onUpdate({
                x: props.x - (position.offset.x - x),
                y: props.y - (position.offset.y - y),
            })
        }
    }

    const handlePointerUp = (e) => {
        setPosition({
            active: false,
        })
    }

    return (
        <g onMouseLeave={() => setOver(false)} onMouseOver={() => setOver(true)}>
            <rect
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onClick={props.onDelete}
                className="rectangle-component"
                x={props.x}
                y={props.y}
                width={props.width}
                height={props.height}
                stroke={props.stroke}
                fill={props.fill}
                strokeWidth={5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />

            {over && !beingDragged && (
                <>
                    <ResizableComponent
                        updateY
                        onUpdate={(difference) => {
                            props.onUpdate({
                                height: props.height - difference,
                                y: props.y + difference,
                            })
                        }}
                        x={props.x + props.width / 2}
                        y={props.y}
                    />
                    <ResizableComponent
                        updateY
                        onUpdate={(difference) => {
                            props.onUpdate({
                                height: props.height + difference,
                            })
                        }}
                        x={props.x + props.width / 2}
                        y={props.y + props.height}
                    />
                    <ResizableComponent
                        updateX
                        onUpdate={(difference) => {
                            props.onUpdate({
                                width: props.width - difference,
                                x: props.x + difference,
                            })
                        }}
                        x={props.x}
                        y={props.y + props.height / 2}
                    />
                    <ResizableComponent
                        updateX
                        onUpdate={(difference) => {
                            props.onUpdate({
                                width: props.width + difference,
                            })
                        }}
                        x={props.x + props.width}
                        y={props.y + props.height / 2}
                    />
                </>
            )}
        </g>
    )
}

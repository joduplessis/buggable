import React, { useEffect, useState } from 'react'
import './resizable.component.css'

export function ResizableComponent(props) {
    const [position, setPosition] = useState({
        x: 320,
        y: 320,
        active: false,
        offset: {},
    })

    const handlePointerDown = (e) => {
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        el.setPointerCapture(e.pointerId)
        setPosition({
            ...position,
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
            const newX = position.x - (position.offset.x - x)
            const newY = position.y - (position.offset.y - y)
            const differenceX = newX - props.x
            const differenceY = newY - props.y

            if (props.updateY) {
                props.onUpdate(differenceY)
                setPosition({ ...position, y: newY })
            }

            if (props.updateX) {
                props.onUpdate(differenceX)
                setPosition({ ...position, x: newX })
            }
        }
    }

    const handlePointerUp = (e) => {
        setPosition({
            ...position,
            active: false,
        })
    }

    useEffect(() => {
        setPosition({
            ...position,
            x: props.x,
            y: props.y,
        })
    }, [props.x, props.y])

    return (
        <rect
            transform="translate(-5 -5)"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            id="resize"
            fill="#991155"
            x={position.x}
            y={position.y}
            width="10"
            height="10"
        />
    )
}

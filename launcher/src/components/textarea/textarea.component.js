import React, { useEffect, useRef, useState } from 'react'
import './textarea.component.css'

export const TextareaComponent = (props) => {
    const textareaRef = useRef(null)
    const resizeRef = useRef(null)
    const MIN_HEIGHT = 100

    const adjustHeight = () => {
        if (textareaRef.current) {
            if (textareaRef.current.style) {
                const minHeight =
                    textareaRef.current.scrollHeight < MIN_HEIGHT ? MIN_HEIGHT : textareaRef.current.scrollHeight
                textareaRef.current.style.height = '1px'
                textareaRef.current.style.height = minHeight + 'px'
            }
        }
    }

    const handleChange = (e) => {
        //processValue(e.target.value)
        props.onChange(e.target.value)
        console.log(e.target.value)
    }

    const handleBlur = (e) => {
        if (props.onBlur) processValue(e.target.value)
    }

    const processValue = (text) => {
        props.onChange(text)
    }

    // Focus
    useEffect(() => {
        if (props.focus) {
            if (textareaRef.current && props.focus) textareaRef.current.focus()
        }
    }, [props.focus])

    // Resize
    useEffect(() => {
        resizeRef.current = setInterval(() => {
            adjustHeight()
        }, 20)

        return () => clearInterval(resizeRef.current)
    })

    return (
        <textarea
            ref={textareaRef}
            onFocus={(e) => e.currentTarget.select()}
            disabled={!!props.disabled}
            placeholder={props.placeholder}
            value={props.value}
            className="screenshotter__textarea-component"
            onChange={handleChange}
            onBlur={handleBlur}
        />
    )
}

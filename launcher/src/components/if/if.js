import React from 'react'

export const If = (props) => {
    if (props.if && props.children) {
        return props.children
    } else {
        return null
    }
}

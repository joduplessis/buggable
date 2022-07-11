import React, { useEffect, useState, useContext, FunctionComponent, ReactElement } from 'react'
import './error.component.css'

export const ErrorComponent = (props) => {
    if (!props.error) return null

    return (
        <div className="error-component">
            <p>{props.error}</p>
        </div>
    )
}

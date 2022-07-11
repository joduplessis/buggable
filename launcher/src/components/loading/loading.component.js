import React, { useEffect, useState, useContext, FunctionComponent, ReactElement } from 'react'
import './loading.component.css'

export const LoadingComponent = (props) => {
    if (!props.loading) return null

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(255,255,255,0.75',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                zIndex: 90,
            }}
        >
            <div className="loading-component">
                <div className="loading-component__loader">
                    <div className="loading-component__spinner">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { AppProvider } from './contexts/app.context'
import { App } from './app'

// These extend basic JS objects via prototype
import './helpers/extensions'

// Global style rules
import './styles.css'

const div = document.createElement('div')
document.body.appendChild(div)
ReactDOM.render(
    <AppProvider>
        <App />
    </AppProvider>,
    div
)

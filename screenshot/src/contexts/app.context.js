import React from 'react'
import { useState, useEffect, useContext } from 'react'

export const AppContext = React.createContext({
    user: null,
    setApp: () => {},
})

export const AppProvider = (props) => {
    const setApp = (appState) => {
        setState({ ...state, ...appState })
    }
    const initialState = {
        user: null,
        setApp,
    }
    const [state, setState] = useState(initialState)

    return <AppContext.Provider value={state}>{props.children}</AppContext.Provider>
}

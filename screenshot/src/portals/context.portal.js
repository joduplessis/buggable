import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class ContextPortal extends React.Component {
    contextPopupRoot

    constructor(props) {
        super(props)

        this.contextPopupRoot = document.getElementById('context-root')
        this.el = document.createElement('div')
    }

    componentDidMount() {
        this.contextPopupRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        this.contextPopupRoot.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

ContextPortal.propTypes = {
    chidlren: PropTypes.any,
}

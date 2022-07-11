import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export class ModalPortal extends React.Component {
    modalRoot

    constructor(props) {
        super(props)

        this.modalRoot = document.getElementById('modal-root')
        this.el = document.createElement('div')
    }

    componentDidMount() {
        this.modalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        this.modalRoot.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

ModalPortal.propTypes = {
    chidlren: PropTypes.any,
}

import React from 'react'

const MIN_HEIGHT = 25

export class TextareaComponent extends React.Component {
    constructor(props) {
        super(props)

        this.textareaRef = React.createRef()
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    handleKeyDown(e) {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault()
            if (this.props.onEnter) this.props.onEnter()
        }
    }

    componentDidMount() {
        if (this.textareaRef) {
            if (this.textareaRef.style) {
                this.textareaRef.style.height = '1px'
                const minHeight =
                    this.textareaRef.scrollHeight < MIN_HEIGHT ? MIN_HEIGHT : this.textareaRef.scrollHeight
                this.textareaRef.style.height = minHeight + 'px'
                this.textareaRef.select()
            }
        }
    }

    render() {
        if (this.textareaRef) {
            if (this.textareaRef.style) {
                this.textareaRef.style.height = '1px'
                const minHeight =
                    this.textareaRef.scrollHeight < MIN_HEIGHT ? MIN_HEIGHT : this.textareaRef.scrollHeight
                this.textareaRef.style.height = minHeight + 'px'
            }
        }

        return <textarea ref={(ref) => (this.textareaRef = ref)} {...this.props} onKeyDown={this.handleKeyDown} />
    }
}

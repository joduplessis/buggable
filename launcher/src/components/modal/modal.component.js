import React, { useEffect, useRef, useState } from 'react'
import './modal.component.css'
import { IconComponent } from '../../components/icon/icon.component'
import { BUG, FEATURE, GENERAL, LAUNCHER, RATING, THEME, VIEW } from '../../constants'
import { If } from '../../components/if/if'
import { classNames, getThemeClass, highestZIndex, isDarkMode } from '../../helpers/util'

export const ModalComponent = (props) => {
    const contentRef = useRef()
    const [zIndex, setZIndex] = useState(100)
    const { button, context, theme } = props
    const [opacity, setOpacity] = useState(context ? 0 : 1)
    const [top, setTop] = useState(0)
    const [left, setLeft] = useState(0)
    const screenshotter__darkmode = getThemeClass(theme) == THEME.DARK
    const classes = classNames({ 'screenshotter__modal-component': true, context, screenshotter__darkmode })
    const outerClasses = classNames({ 'screenshotter__modal-component__outer': true, context, screenshotter__darkmode })

    const handleBackgroundClick = (e) => {
        //if ((contentRef, contentRef.current.contains(event.target))) return
        //props.onDismiss()
    }

    const getModalPosition = () => {
        const buffer = 10
        const contentPos = contentRef.current.getBoundingClientRect()
        const buttonPos = button.getBoundingClientRect()
        const { innerWidth, innerHeight, scrollY } = window
        const half = contentPos.height / 2
        const top = button.offsetTop + buttonPos.height / 2
        const realTop = top - half
        const left =
            buttonPos.left < innerWidth / 2
                ? buttonPos.width + buttonPos.left + buffer
                : buttonPos.left - contentPos.width - buffer
        const moveDown = realTop < scrollY
        const moveUp = buttonPos.y + half > innerHeight

        setLeft(left)
        setTop(moveDown ? scrollY + half : moveUp ? innerHeight - half : top)
        setOpacity(1)
    }

    useEffect(() => {
        if (!!button && !!contentRef.current) getModalPosition()
        setZIndex(highestZIndex())
    }, [button, contentRef.current])

    const renderInner = () => {
        const innerClasses = classNames({ 'screenshotter__modal-component__inner': true, context, screenshotter__darkmode })
        const styles = context ? { left, top, opacity } : null

        return (
            <div className={innerClasses} ref={contentRef} style={styles}>
                <div className="screenshotter__modal-component__close" onClick={props.onDismiss}>
                    <IconComponent icon="close" size={20} />
                </div>

                <If if={!!props.action}>
                    <div className="screenshotter__modal-component__back" onClick={props.onBack}>
                        <IconComponent icon="back" size={20} />
                    </div>
                </If>

                <div className="screenshotter__modal-component__body">
                    <div className="screenshotter__modal-component__body-inner">{props.children}</div>
                </div>
            </div>
        )
    }

    return (
        <>
            {context && <>{renderInner()}</>}

            {!context && (
                <div className={classes} style={{ zIndex }}>
                    <div className={outerClasses} onClick={handleBackgroundClick}>
                        {renderInner()}
                    </div>
                </div>
            )}
        </>
    )
}

import React, { Component, forwardRef, useRef, useState, useEffect } from 'react'
import { IconComponent } from './components/icon/icon.component'
import { classNames, sendMessageToParent, bindEvent, dataURLtoFile, uploadFile } from './helpers/util'
import './app.css'
import {
    CIRCLE,
    FREEHAND,
    RECTANGLE,
    COMMENT,
    ARROW,
    ELLIPSE,
    DELETE,
    CLOSE,
    SAVE,
    AUDIO,
    COLORS,
    RECORDING,
    SCREENSHOTTER,
} from './constants'
import { SCREENSHOTTER_CLOSE, SCREENSHOTTER_SAVE } from './constants'
import html2canvas from 'html2canvas'
import { RectangleComponent } from './components/rectangle/rectangle.component'
import { LineComponent } from './components/line/line.component'
import { ArrowComponent } from './components/arrow/arrow.component'
import { CommentComponent } from './components/comment/comment.component'
import { CommentsComponent } from './components/comments/comments.component'
import { CrosshairComponent } from './components/crosshair/crosshair.component'
import { SCREENSHOT } from './constants'

export const App = (props) => {
    const drawArea = useRef(null)
    const canvasRef = useRef(null)
    const [lines, setLines] = useState([])
    const [arrows, setArrows] = useState([])
    const [comments, setComments] = useState([
        /* {
            x: 200,
            y: 200,
            description: 'This is very cool',
            replies: [{ user: 'jo', text: 'Hello there!', date: 'Fri' }],
            attachments: [
                { url: 'https://some.url.with.a.file/filename.pdf', name: 'filename.pdf', type: '' },
                {
                    url: 'https://freesound.org/data/previews/587/587831_5674468-lq.ogg',
                    name: 'something.ogg',
                    type: 'audio/ogg',
                },
            ],
        }, */
    ])
    const [rectangles, setRectangles] = useState([])
    const [drawing, setDrawing] = useState(false)
    const [tool, setTool] = useState(null)
    const [aim, setAim] = useState(false)
    const [crosshair, setCrosshair] = useState({ x: 0, y: 0 })
    const [error, setError] = useState(null)
    const [fill, setFill] = useState('transparent')
    const [stroke, setStroke] = useState(COLORS[0])
    const [showFill, setShowFill] = useState(false)
    const [showStroke, setShowStroke] = useState(false)
    const { innerWidth, innerHeight } = window

    const handleUpload = async (dataUrl) => {
        try {
            const { devicePixelRatio, innerWidth, innerHeight } = window
            const width = innerWidth
            const height = innerHeight
            const name = new Date().getTime() + '.png'
            const file = dataURLtoFile(dataUrl, name)
            //const { url } = await uploadFile(file)
            const url = 'demo'
            const media = SCREENSHOT
            const type = 'image/png'
            const payload = {
                url,
                name,
                type,
                media,
                meta: {
                    width,
                    height,
                    devicePixelRatio,
                    lines,
                    arrows,
                    comments,
                    rectangles,
                },
            }

            sendMessageToParent({ type: SCREENSHOTTER.EVENTS.SAVE.SCREENSHOT, payload })
        } catch (e) {
            setError(e.message)
        }
    }

    const handleDone = () => {
        const elementSvg = document.getElementById('app__svg')
        const DOMURL = self.URL || self.webkitURL || self
        const { parent, devicePixelRatio, innerWidth, innerHeight } = window

        setAim(false)
        setTool(null)
        setDrawing(false)

        html2canvas(parent.document.body, {
            scrollY: -parent.window.scrollY,
            height: parent.innerHeight,
            width: innerWidth,
            logging: false,
        })
            .then((canvasHtml) => {
                let image = new Image()
                let canvasSvg = document.createElement('canvas')

                image.width = innerWidth * devicePixelRatio
                image.height = innerHeight * devicePixelRatio
                image.style.width = innerWidth + 'px'
                image.style.height = innerHeight + 'px'

                canvasSvg.width = innerWidth * devicePixelRatio
                canvasSvg.height = innerHeight * devicePixelRatio
                canvasSvg.style.width = innerWidth + 'px'
                canvasSvg.style.height = innerHeight + 'px'

                image.src = DOMURL.createObjectURL(
                    new Blob([new XMLSerializer().serializeToString(elementSvg)], {
                        type: 'image/svg+xml;charset=utf-8',
                    })
                )
                image.onload = function () {
                    canvasSvg.getContext('2d').drawImage(image, 0, 0)
                    canvasSvg.getContext('2d').drawImage(canvasHtml, 0, 0)

                    // window.open().document.write('<img src="' + canvasSvg.toDataURL("image/png") + '" />')
                    // window.open().document.write('<img src="' + canvasHtml.toDataURL("image/png") + '" />')
                    // DOMURL.revokeObjectURL(svgPng)
                    // handleUpload(canvasSvg.toDataURL('image/png'))
                    handleUpload(canvasHtml.toDataURL('image/png'))
                }
            })
            .catch((e) => {
                setError(e.message)
            })
    }

    // 1
    const handleMouseDown = (mouseEvent) => {
        const { x, y } = relativeCoordinatesForEvent(mouseEvent)
        const arrow = { sx: x, sy: y, ex: x + 10, ey: y + 10, color: stroke }
        const line = { points: [{ x, y }], color: stroke }
        const rectangle = { originX: x, originY: y, x: x, y: y, width: 0, height: 0, fill, stroke }
        const comment = { description: '', x, y, attachments: [], replies: [] }

        switch (tool) {
            case COMMENT:
                setAim(false)
                setComments([...comments, comment])
                break
            case ARROW:
                setAim(false)
                setDrawing(true)
                setArrows([...arrows, arrow])
                break
            case FREEHAND:
                setAim(false)
                setDrawing(true)
                setLines([...lines, ...[line]])
                break
            case RECTANGLE:
                setAim(false)
                setDrawing(true)
                setRectangles([...rectangles, rectangle])
                break
        }
    }

    // 2
    const handleMouseMove = (mouseEvent) => {
        const { x, y } = relativeCoordinatesForEvent(mouseEvent)
        const point = { x, y }

        // Rectangle
        if (drawing && tool == RECTANGLE) {
            setRectangles(
                rectangles.map((rectangle, index) => {
                    if (index == rectangles.length - 1) {
                        let rectangleX
                        let rectangleY
                        let rectangleWidth
                        let rectangleHeight

                        // Calculate width & x
                        if (x < rectangle.originX) {
                            rectangleX = x
                            rectangleWidth = rectangle.originX - x
                        } else {
                            rectangleX = rectangle.originX
                            rectangleWidth = x - rectangle.originX
                        }

                        // Calculate height & y
                        if (y < rectangle.originY) {
                            rectangleY = y
                            rectangleHeight = rectangle.originY - y
                        } else {
                            rectangleY = rectangle.originY
                            rectangleHeight = y - rectangle.originY
                        }

                        // Create the rectangle
                        return {
                            ...rectangle,
                            width: rectangleWidth,
                            height: rectangleHeight,
                            x: rectangleX,
                            y: rectangleY,
                        }
                    } else {
                        return rectangle
                    }
                })
            )
        }

        // Freehand
        if (drawing && tool == FREEHAND) {
            setLines(
                lines.map((line, index) => {
                    if (index == lines.length - 1) {
                        return { ...line, points: [...line.points, point] }
                    } else {
                        return line
                    }
                })
            )
        }

        // Arrows
        if (drawing && tool == ARROW) {
            setArrows(
                arrows.map((arrow, index) => {
                    if (index == arrows.length - 1) {
                        return { ...arrow, ex: x, ey: y }
                    } else {
                        return arrow
                    }
                })
            )
        }

        setCrosshair(point)
    }

    // 3
    const handleMouseUp = () => {
        setDrawing(false)

        switch (tool) {
            case COMMENT:
                setTool(null)
                break
            case FREEHAND:
                setAim(true)
            case ARROW:
                setAim(true)
                break
            case ELLIPSE:
                setTool(null)
                break
            case RECTANGLE:
                setTool(null)
                setRectangles(
                    rectangles.map((rectangle, index) => {
                        if (index == rectangles.length - 1) {
                            let mutableRectangle = rectangle
                            delete mutableRectangle.originX
                            delete mutableRectangle.originY
                            return mutableRectangle
                        } else {
                            return rectangle
                        }
                    })
                )

                break
        }
    }

    const relativeCoordinatesForEvent = (mouseEvent) => {
        const boundingRect = drawArea.current.getBoundingClientRect()
        return {
            x: mouseEvent.clientX - boundingRect.left,
            y: mouseEvent.clientY - boundingRect.top,
        }
    }

    const handleUpdateComment = (comment, index) => {
        setComments(
            comments.map((t, i) => {
                if (i == index)
                    return {
                        ...t,
                        ...comment,
                    }

                return t
            })
        )
    }

    const handleUpdateRectangle = (rectangle, index) => {
        setRectangles(
            rectangles.map((r, i) => {
                if (i == index)
                    return {
                        ...r,
                        ...rectangle,
                    }

                return r
            })
        )
    }

    const handleElementDelete = (key, index) => {
        if (tool != DELETE) return

        switch (key) {
            case RECTANGLE:
                setRectangles(rectangles.filter((_, i) => i != index))
                break
            case FREEHAND:
                setLines(lines.filter((_, i) => i != index))
                break
            case ARROW:
                setArrows(arrows.filter((_, i) => i != index))
                break
        }
    }

    const handleColorClick = (color) => {
        if (showFill) setFill(color)
        if (showStroke) setStroke(color)

        setShowFill(false)
        setShowStroke(false)
    }

    const activateTool = (key) => {
        switch (key) {
            case ELLIPSE:
                setTool(tool == key ? null : key)
                setAim(tool == key ? false : true)
                break
            case RECTANGLE:
                setTool(tool == key ? null : key)
                setAim(tool == key ? false : true)
                break
            case COMMENT:
                setTool(tool == key ? null : key)
                setAim(tool == key ? false : true)
                break
            case FREEHAND:
                setTool(tool == key ? null : key)
                setAim(tool == key ? false : true)
                break
            case ARROW:
                setTool(tool == key ? null : key)
                // Hack - for some reason only when it's last in the stack
                setTimeout(() => setAim(tool == key ? false : true), 0)
            case DELETE:
                setTool(tool == key ? null : key)
                setAim(false)
                break
            default:
                setTool(null)
                setAim(false)
                break
        }
    }

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp)

        bindEvent(window, 'message', function (e) {
            console.log('RECEVIED FROM PARENT: ' + e.data)
        })

        return document.removeEventListener('mouseup', handleMouseUp)
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        canvas.width = innerWidth
        canvas.height = innerHeight

        ctx.beginPath()

        // background
        ctx.moveTo(0, 0)
        ctx.lineTo(window.innerWidth, 0)
        ctx.lineTo(window.innerWidth, window.innerHeight)
        ctx.lineTo(0, window.innerHeight)
        ctx.lineTo(0, 0)
        ctx.closePath()

        rectangles.map((rectangle) => {
            const { x, y, width, height } = rectangle

            ctx.moveTo(x, y)
            ctx.lineTo(x, y + height)
            ctx.lineTo(x + width, y + height)
            ctx.lineTo(x + width, y)
            ctx.lineTo(x, y)

            ctx.closePath()
        })

        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.strokeStyle = 'rgba(0,0,0,0)'

        ctx.fill()
        ctx.stroke()
    }, [canvasRef, rectangles, innerWidth, innerHeight])

    const renderTool = (icon, key) => {
        const classes = classNames({
            app__tool: true,
            active: key == tool,
        })

        return (
            <div className={classes} onClick={() => activateTool(key)}>
                <IconComponent icon={icon} color="#4a5057" size={20} />
            </div>
        )
    }

    const renderColorIcon = (color) => {
        if (showFill && fill == color)
            return (
                <IconComponent
                    icon={color == 'transparent' ? 'transparent' : 'stroke'}
                    color={color == 'transparent' ? 'black' : color}
                    size={20}
                />
            )
        if (showStroke && stroke == color) return <IconComponent icon="stroke" color={color} size={20} />
        return (
            <IconComponent
                icon={color == 'transparent' ? 'transparent' : 'fill'}
                color={color == 'transparent' ? 'black' : color}
                size={20}
            />
        )
    }

    const renderTools = () => {
        return (
            <>
                {(showStroke || showFill) && (
                    <div className="app__colors">
                        {COLORS.map((color, index) => {
                            if (showStroke && index == COLORS.length - 1) return null
                            return (
                                <span className="app__color" onClick={() => handleColorClick(color)} key={index}>
                                    {renderColorIcon(color)}
                                </span>
                            )
                        })}
                    </div>
                )}

                <div className="app__tools">
                    <div
                        className="app__tool"
                        onClick={() => sendMessageToParent({ type: SCREENSHOTTER.EVENTS.CLOSE, payload: null })}
                    >
                        <IconComponent icon="x" color="#4a5057" size={20} />
                        <div className="app__tool-text">Cancel</div>
                    </div>

                    {renderTool('pointer', null)}
                    {renderTool('comment', COMMENT)}
                    {renderTool('rectangle', RECTANGLE)}
                    {renderTool('freehand', FREEHAND)}
                    {renderTool('arrow', ARROW)}
                    {renderTool('delete', DELETE)}

                    <div
                        className={showStroke ? 'app__tool select_color' : 'app__tool'}
                        onClick={() => {
                            setShowStroke(true)
                            setShowFill(false)
                        }}
                    >
                        <IconComponent icon="stroke" color={stroke} size={20} />
                    </div>

                    <div
                        className={showFill ? 'app__tool select_color' : 'app__tool'}
                        onClick={() => {
                            setShowStroke(false)
                            setShowFill(true)
                        }}
                    >
                        <IconComponent
                            icon={fill == 'transparent' ? 'transparent' : 'fill'}
                            color={fill == 'transparent' ? 'black' : fill}
                            size={20}
                        />
                    </div>

                    <div className="app__tool" onClick={handleDone}>
                        <IconComponent icon="check" color="#4a5057" size={20} />
                        <div className="app__tool-text">Done</div>
                    </div>
                </div>
            </>
        )
    }

    const classes = classNames({
        app: true,
        delete: tool == DELETE,
    })

    return (
        <>
            {renderTools()}

            {/* <CommentsComponent /> */}

            <div className={classes}>
                <div
                    className="app__draw"
                    ref={drawArea}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <CrosshairComponent position={crosshair} active={aim} />

                    {comments.map((comment, index) => (
                        <CommentComponent
                            key={index}
                            index={index}
                            description={comment.description}
                            x={comment.x}
                            y={comment.y}
                            replies={comment.replies}
                            attachments={comment.attachments}
                            onUpdate={(t) => handleUpdateComment(t, index)}
                            onDelete={() => setComments(comments.filter((_, i) => i != index))}
                            onAttachmentDelete={(attachmentIndex) => {
                                setComments(
                                    comments.map((t, i) => {
                                        if (i == index) {
                                            return {
                                                ...t,
                                                attachments: t.attachments.filter((_, i1) => i1 != attachmentIndex),
                                            }
                                        } else {
                                            return t
                                        }
                                    })
                                )
                            }}
                            onAttachmentAdd={(attachment) => {
                                setComments(
                                    comments.map((t, i) => {
                                        if (i == index) {
                                            return {
                                                ...t,
                                                attachments: [...t.attachments, attachment],
                                            }
                                        } else {
                                            return t
                                        }
                                    })
                                )
                            }}
                        />
                    ))}

                    <canvas className="app__background" ref={canvasRef} height="100%" width="100%"></canvas>

                    <svg className="app__svg" id="app__svg">
                        {arrows.map((arrow, index) => (
                            <ArrowComponent
                                key={index}
                                sx={arrow.sx}
                                sy={arrow.sy}
                                ex={arrow.ex}
                                ey={arrow.ey}
                                color={arrow.color}
                                onDelete={() => handleElementDelete(ARROW, index)}
                            />
                        ))}

                        {lines.map((line, index) => (
                            <LineComponent
                                key={index}
                                points={line.points}
                                color={line.color}
                                onDelete={() => handleElementDelete(FREEHAND, index)}
                            />
                        ))}

                        {rectangles.map((rectangle, index) => (
                            <RectangleComponent
                                key={index}
                                rectangle={rectangle}
                                originX={rectangle.originX}
                                originY={rectangle.originY}
                                x={rectangle.x}
                                y={rectangle.y}
                                width={rectangle.width}
                                height={rectangle.height}
                                fill={rectangle.fill}
                                stroke={rectangle.stroke}
                                onDelete={() => handleElementDelete(RECTANGLE, index)}
                                onUpdate={(r) => handleUpdateRectangle(r, index)}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </>
    )
}

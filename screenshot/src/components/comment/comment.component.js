import React, { useEffect, useRef, useState } from 'react'
import './comment.component.css'
import { TextareaComponent } from '../textarea/textarea.component'
import { IconComponent } from '../icon/icon.component'
import { blobToFile, uploadFile } from '../../helpers/util'

export function CommentComponent(props) {
    const fileRef = useRef(null)
    const divRef = useRef(null)
    const audioRef = useRef(null)
    const [visible, setVisible] = useState(true)
    const [reply, setReply] = useState('')
    const [over, setOver] = useState(false)
    const [record, setRecord] = useState(false)
    const [recording, setRecording] = useState(false)
    const [active, setActive] = useState(false)
    const [position, setPosition] = useState({})
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)

    const startCapture = async () => {
        let audioStream = null

        try {
            audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        } catch (e) {
            console.log(e)
            setRecording(false)
            setRecord(false)
        }

        return audioStream
    }

    const createStreamRecording = async (stream) => {
        setRecording(true)

        try {
            const chunks = []
            const recorder = new MediaRecorder(stream)

            recorder.ondataavailable = (e) => chunks.push(e.data)
            recorder.onstop = (e) => {
                const { type } = chunks[0]
                const blob = new Blob(chunks, { type })
                const filename = `audio-${new Date().getTime()}.ogg`

                handleUpload(blobToFile(blob, filename))
            }
            recorder.start()
        } catch (e) {
            console.log(e)
            setRecording(false)
            setRecord(false)
        }
    }

    const handlePointerDown = (e) => {
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top

        el.setPointerCapture(e.pointerId)

        setActive(true)
        setPosition({ x, y })
    }

    const handlePointerMove = (e) => {
        if (active) {
            const bbox = e.target.getBoundingClientRect()
            const x = e.clientX - bbox.left
            const y = e.clientY - bbox.top

            props.onUpdate({
                x: props.x - (position.x - x),
                y: props.y - (position.y - y),
            })
        }
    }

    const handlePointerUp = (e) => {
        e.preventDefault()
        e.stopPropagation()

        setActive(false)
    }

    const handleClick = (e) => {
        setVisible(true)
        setRecord(false)
    }

    const handleFileChange = (e) => {
        if (e.target.files.length == 0) return
        handleUpload(e.target.files[0])
    }

    const handleUpload = async (file) => {
        try {
            const { url } = await uploadFile(file)
            const { name, type } = file

            props.onAttachmentAdd({ url, name, type })
        } catch (e) {
            console.log(e)
        }
    }

    const handleSendReply = () => {
        setReply('')
    }

    const handleDelete = (e) => {
        if (!confirm('Are you sure?')) return
        props.onDelete()
    }

    const handleRecord = (e) => {
        setRecord(true)
        setRecording(false)
    }

    const handleStart = async () => {
        const audioStream = await startCapture()

        if (audioStream) {
            audioRef.current = audioStream
            createStreamRecording(audioStream)
        }
    }

    const handleStop = () => {
        if (audioRef.current) audioRef.current.getTracks().forEach((track) => track.stop())

        setRecord(false)
        setRecording(false)
    }

    const handleOkay = () => {
        setRecord(false)
        setVisible(false)
        setOver(false)
    }

    const updateCoordinates = () => {
        const { x, y } = props
        const { innerWidth, innerHeight } = window
        let yOffset = 0
        let xOffset = 0

        if (divRef.current) {
            const { height, width } = divRef.current.getBoundingClientRect()
            const containerHeight = height
            const containerWidth = width + 20

            if (y + containerHeight > innerHeight) yOffset = y + containerHeight - innerHeight
            if (x + containerWidth > innerWidth) xOffset = containerWidth + 20
        }

        setLeft(x - xOffset)
        setTop(y - yOffset)
    }

    useEffect(() => {
        updateCoordinates()
    }, [divRef, visible, props.x, props.y])

    return (
        <>
            <div
                onMouseOver={() => setOver(true)}
                onMouseLeave={() => setOver(false)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                className="comment-component__number"
                style={{
                    left: props.x,
                    top: props.y,
                }}
            >
                <div className="comment-component__number-number">#{props.index + 1}</div>
                <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />

                {over && !visible && (
                    <div className="comment-component__number-tools">
                        <div className="comment-component__number-tools-icon" onClick={handleClick}>
                            <IconComponent icon="eye" color="white" size={18} />
                        </div>
                        <div className="comment-component__number-tools-icon" onClick={handleDelete}>
                            <IconComponent icon="delete-fill" color="white" size={18} />
                        </div>
                    </div>
                )}
            </div>

            {visible && (
                <div ref={divRef} className="comment-component" style={{ left, top }}>
                    <div className="comment-component__main">
                        <div className="comment-component__content">
                            {record && (
                                <div className="comment-component__content-record">
                                    {recording && (
                                        <div className="comment-component__content-recording">
                                            <div style={{ width: 50, height: 50 }}>
                                                <Wave />
                                            </div>

                                            <div
                                                className="comment-component__content-record-button"
                                                onClick={handleStop}
                                            >
                                                <IconComponent icon="stop" color="white" size={13} />
                                                <div className="comment-component__content-record-button-text">
                                                    Stop
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!recording && (
                                        <>
                                            <div
                                                className="comment-component__content-record-button"
                                                onClick={handleStart}
                                            >
                                                <IconComponent icon="play" color="white" size={13} />
                                                <div className="comment-component__content-record-button-text">
                                                    Start
                                                </div>
                                            </div>

                                            <div
                                                className="comment-component__content-record-button"
                                                onClick={() => setRecord(false)}
                                            >
                                                <IconComponent icon="x" color="white" size={13} />
                                                <div className="comment-component__content-record-button-text">
                                                    Cancel
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <TextareaComponent
                                placeholder="Enter some text..."
                                className="comment-component__textarea"
                                value={props.description}
                                onChange={(e) => props.onUpdate({ description: e.target.value })}
                            />

                            <div className="comment-component__attachments">
                                {props.attachments.map((attachment, index) => (
                                    <Attachment
                                        key={index}
                                        url={attachment.url}
                                        name={attachment.name}
                                        type={attachment.type}
                                        onDelete={() => {
                                            if (confirm('Are you sure?')) props.onAttachmentDelete(index)
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="comment-component__comment-replies">
                            {props.replies.map((reply, index) => (
                                <div className="comment-component__comment-reply" key={index}>
                                    <div className="comment-component__comment-reply-text">
                                        <strong>@{reply.user}</strong> {reply.text}
                                    </div>
                                    <div className="comment-component__comment-reply-date">{reply.date}</div>
                                </div>
                            ))}

                            <TextareaComponent
                                className="comment-component__comment-textarea"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                onEnter={handleSendReply}
                                placeholder="Type & press enter"
                                style={{ backgroundColor: '#f2f3f5', width: '100%', borderRadius: 10 }}
                            />
                        </div>
                    </div>

                    <div className="comment-component__tools">
                        <div className="comment-component__tools-icon" onClick={handleRecord}>
                            <IconComponent icon="audio" color="#ea1d5d" size={18} />
                        </div>

                        <div className="comment-component__tools-icon" onClick={() => fileRef.current.click()}>
                            <IconComponent icon="attachment" color="#ea1d5d" size={18} />
                        </div>

                        <div className="comment-component__tools-icon" onClick={handleDelete}>
                            <IconComponent icon="delete" color="#ea1d5d" size={18} />
                        </div>

                        <div className="comment-component__tools-icon" onClick={handleOkay}>
                            <IconComponent icon="check" color="#ea1d5d" size={18} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const Attachment = ({ url, name, type, onDelete }) => {
    const isAudio = type.split('/')[0] == 'audio'
    const [play, setPlay] = useState(false)
    const audioRef = useRef(isAudio ? new Audio(url) : null)

    const handleStop = async () => {
        setPlay(false)
        try {
            await audioRef.current.pause()
        } catch (err) {
            console.log('Failed to stop...' + err)
        }
    }

    const handlePlay = async () => {
        setPlay(true)
        try {
            await audioRef.current.play()
        } catch (err) {
            console.log('Failed to play...' + err)
        }
    }

    useEffect(() => {
        if (!audioRef.current) return

        audioRef.current.addEventListener('ended', () => setPlay(false))

        return () => {
            audioRef.current.removeEventListener('ended', () => setPlay(false))
        }
    }, [audioRef])

    return (
        <div className="comment-component__attachment">
            <IconComponent icon="attachment" color="#adb5be" size={12} />

            <a className="comment-component__attachment-text" href={url} target="_blank">
                {name}
            </a>

            {isAudio && (
                <div className="comment-component__attachment-icon" onClick={play ? handleStop : handlePlay}>
                    <IconComponent icon={play ? 'stop' : 'play'} color="#adb5be" size={12} />
                </div>
            )}

            <div className="comment-component__attachment-icon" onClick={onDelete}>
                <IconComponent icon="delete" color="#adb5be" size={12} />
            </div>
        </div>
    )
}

const Wave = (props) => {
    return (
        <svg id="wave" data-name="Layer 1" viewBox="0 0 50 38.05">
            <path
                id="Line_1"
                data-name="Line 1"
                d="M0.91,15L0.78,15A1,1,0,0,0,0,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H0.91Z"
            />
            <path
                id="Line_2"
                data-name="Line 2"
                d="M6.91,9L6.78,9A1,1,0,0,0,6,10V28a1,1,0,1,0,2,0s0,0,0,0V10A1,1,0,0,0,7,9H6.91Z"
            />
            <path
                id="Line_3"
                data-name="Line 3"
                d="M12.91,0L12.78,0A1,1,0,0,0,12,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H12.91Z"
            />
            <path
                id="Line_4"
                data-name="Line 4"
                d="M18.91,10l-0.12,0A1,1,0,0,0,18,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H18.91Z"
            />
            <path
                id="Line_5"
                data-name="Line 5"
                d="M24.91,15l-0.12,0A1,1,0,0,0,24,16v6a1,1,0,0,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H24.91Z"
            />
            <path
                id="Line_6"
                data-name="Line 6"
                d="M30.91,10l-0.12,0A1,1,0,0,0,30,11V27a1,1,0,1,0,2,0s0,0,0,0V11a1,1,0,0,0-1-1H30.91Z"
            />
            <path
                id="Line_7"
                data-name="Line 7"
                d="M36.91,0L36.78,0A1,1,0,0,0,36,1V37a1,1,0,1,0,2,0s0,0,0,0V1a1,1,0,0,0-1-1H36.91Z"
            />
            <path
                id="Line_8"
                data-name="Line 8"
                d="M42.91,9L42.78,9A1,1,0,0,0,42,10V28a1,1,0,1,0,2,0s0,0,0,0V10a1,1,0,0,0-1-1H42.91Z"
            />
            <path
                id="Line_9"
                data-name="Line 9"
                d="M48.91,15l-0.12,0A1,1,0,0,0,48,16v6a1,1,0,1,0,2,0s0,0,0,0V16a1,1,0,0,0-1-1H48.91Z"
            />
        </svg>
    )
}

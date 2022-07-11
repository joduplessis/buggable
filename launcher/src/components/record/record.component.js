import React, { useEffect, useRef, useState } from 'react'
import { BUG, FEATURE, GENERAL, FILE, RECORDING } from '../../constants'
import './record.component.css'
import { TextareaComponent } from '../textarea/textarea.component'
import { InputComponent } from '../input/input.component'
import { If } from '../if/if'
import { blobToFile, uploadFile, dataURLtoFile } from '../../helpers/util'

export function RecordComponent(props) {
    const thumbnailRef = useRef(null)
    const screenStreamRef = useRef(null)
    const cameraStreamRef = useRef(null)
    const [permissionError, setPermissionError] = useState(false)
    const [error, setError] = useState(null)
    const [top, setTop] = useState(true)
    const [recording, setRecording] = useState(false)
    const [audio, setAudio] = useState(true)
    const [video, setVideo] = useState(true)

    const startCapture = async (audio, video) => {
        setPermissionError(false)
        setVideo(video)
        setAudio(audio)

        let cameraStream = null
        let screenStream = null

        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
            cameraStream = await navigator.mediaDevices.getUserMedia({ audio, video })
        } catch (e) {
            setPermissionError(true)
        }

        return { cameraStream, screenStream }
    }

    const handleUpload = async (file) => {
        setError(false)

        try {
            const { name, type } = file
            const result = await uploadFile(file)
            const { url } = result

            return url
        } catch (e) {
            console.log(e)
            setError(true)
        }
    }

    const handleStop = () => {
        stop()
    }

    const handleCancel = () => {
        stop()
        props.onCancel()
    }

    const handleStart = async (audio, video) => {
        setError(false)
        setRecording(false)

        try {
            let cameraUrl,
                screenUrl,
                url = null
            const media = RECORDING
            const name = 'Recording #' + Math.floor(new Date().getTime() / 1000) + '.png'
            const type = 'image/png'
            const { cameraStream, screenStream } = await startCapture(audio, video)

            // Screen recording
            if (screenStream) {
                const screenChunks = []
                const screenRecorder = new MediaRecorder(screenStream)
                const video = document.createElement('video')

                // Get a screenshot
                video.srcObject = screenStream
                video.onloadedmetadata = async () => {
                    video.play()
                    video.pause()

                    const canvas = document.createElement('canvas')
                    const context = canvas.getContext('2d')

                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

                    const filename = `${name}.png`
                    const base64 = canvas.toDataURL('image/png')
                    const file = dataURLtoFile(base64, filename)

                    url = await handleUpload(file)
                }

                screenStreamRef.current = screenStream
                screenRecorder.ondataavailable = (e) => screenChunks.push(e.data)
                screenRecorder.start()
                screenRecorder.onstop = async (e) => {
                    const { type } = screenChunks[0]
                    const blob = new Blob(screenChunks, { type })
                    const isVideo = type.substring(0, 5).toLowerCase() == 'video'
                    const filename = `${isVideo ? 'video' : 'audio'}-${new Date().getTime()}.${
                        isVideo ? 'webm' : 'ogg'
                    }`
                    const url = await handleUpload(blobToFile(blob, filename))
                    const urlObject = { url, type, name: filename }

                    // If the other stream has not finished, but needs to
                    if (cameraStream) {
                        if (!cameraUrl) {
                            screenUrl = urlObject
                        } else {
                            done(urlObject, cameraUrl, name, media, url, type)
                        }
                    } else {
                        done(urlObject, cameraUrl, name, media, url, type)
                    }
                }
            }

            // Camera recording
            if (cameraStream) {
                const cameraChunks = []
                const cameraRecorder = new MediaRecorder(cameraStream)

                // So they can see themselves
                thumbnailRef.current.srcObject = cameraStream

                cameraStreamRef.current = cameraStream
                cameraRecorder.ondataavailable = (e) => cameraChunks.push(e.data)
                cameraRecorder.start()
                cameraRecorder.onstop = async (e) => {
                    const { type } = cameraChunks[0]
                    const blob = new Blob(cameraChunks, { type })
                    const isVideo = type.substring(0, 5).toLowerCase() == 'video'
                    const filename = `${isVideo ? 'video' : 'audio'}-${new Date().getTime()}.${
                        isVideo ? 'webm' : 'ogg'
                    }`
                    const url = await handleUpload(blobToFile(blob, filename))
                    const urlObject = { url, type, name: filename }

                    // If the other stream has not finished, but needs to
                    if (screenStream) {
                        if (!screenUrl) {
                            cameraUrl = urlObject
                        } else {
                            done(screenUrl, urlObject, name, media, url, type)
                        }
                    } else {
                        done(screenUrl, urlObject, name, media, url, type)
                    }
                }
            }

            // Start recording visually
            setRecording(true)
        } catch (e) {
            setError(true)
            setRecording(false)
        }
    }

    const done = (screenUrl, cameraUrl, name, media, url, type) => {
        props.onDone({ meta: { screenUrl, cameraUrl }, name, media, url, type })
    }

    const stop = () => {
        if (cameraStreamRef.current) cameraStreamRef.current.getTracks().forEach((track) => track.stop())
        if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach((track) => track.stop())

        setRecording(false)
        setPermissionError(false)
        setError(false)
        setVideo(true)
        setAudio(true)
    }

    return (
        <>
            <If if={permissionError}>
                <div className="record-component__permissions-error" style={{ top: top ? 100 : 0 }}>
                    <div className="record-component__permissions-error-text">
                        We need your permission to use your camera & record your screen.
                    </div>
                </div>
            </If>

            <If if={error}>
                <div className="record-component__error">
                    <div className="record-component__error-text">Sorry, there has been an error.</div>
                </div>
            </If>

            <div
                className="record-component__toolbar"
                style={{ top: top ? 0 : null, bottom: !top ? 0 : null, zIndex: props.zIndex }}
            >
                <If if={!recording}>
                    <div className="record-component__button start" onClick={() => handleStart(false, false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            {/* <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"></path> */}
                            <path d="M5 5L10 5 10 3 3 3 3 10 5 10zM10 19L5 19 5 14 3 14 3 21 10 21zM21 14L19 14 19 19 14 19 14 21 21 21zM19 10L21 10 21 3 14 3 14 5 19 5z"></path>
                        </svg>
                        <div className="record-component__button-text">Record screen</div>
                    </div>
                </If>
                &nbsp;
                <If if={!recording}>
                    <div className="record-component__button start" onClick={() => handleStart(true, true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12,2c-4.963,0-9,4.038-9,9c0,3.328,1.82,6.232,4.513,7.79l-2.067,1.378c-0.366,0.244-0.53,0.7-0.402,1.122S5.56,22,6,22 h12c0.44,0,0.829-0.288,0.957-0.71s-0.036-0.878-0.402-1.122l-2.067-1.378C19.18,17.232,21,14.328,21,11C21,6.038,16.963,2,12,2z M12,18c-3.859,0-7-3.141-7-7c0-3.86,3.141-7,7-7s7,3.14,7,7C19,14.859,15.859,18,12,18z"></path>
                            <path d="M12,6c-2.757,0-5,2.243-5,5s2.243,5,5,5s5-2.243,5-5S14.757,6,12,6z M12,14c-1.654,0-3-1.346-3-3s1.346-3,3-3s3,1.346,3,3 S13.654,14,12,14z"></path>
                        </svg>
                        <div className="record-component__button-text">Record screen & webcam</div>
                    </div>
                </If>
                &nbsp;
                <If if={!recording}>
                    <div className="record-component__button start" onClick={() => handleStart(true, false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M16,12V6c0-2.217-1.785-4.021-3.979-4.021c-0.069,0-0.14,0.009-0.209,0.025C9.693,2.104,8,3.857,8,6v6c0,2.206,1.794,4,4,4 S16,14.206,16,12z M10,12V6c0-1.103,0.897-2,2-2c0.055,0,0.109-0.005,0.163-0.015C13.188,4.06,14,4.935,14,6v6c0,1.103-0.897,2-2,2 S10,13.103,10,12z"></path>
                            <path d="M6,12H4c0,4.072,3.061,7.436,7,7.931V22h2v-2.069c3.939-0.495,7-3.858,7-7.931h-2c0,3.309-2.691,6-6,6S6,15.309,6,12z"></path>
                        </svg>
                        <div className="record-component__button-text">Record screen & audio only</div>
                    </div>
                </If>
                &nbsp;
                <If if={recording}>
                    <div className="record-component__button stop" onClick={handleStop}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M10 15.586L6.707 12.293 5.293 13.707 10 18.414 19.707 8.707 18.293 7.293z"></path>
                        </svg>
                        <div className="record-component__button-text">Stop</div>
                    </div>
                </If>
                <div style={{ flex: 1 }} />
                <div className="record-component__button" onClick={handleCancel}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z"></path>
                    </svg>
                    <div className="record-component__button-text">Cancel</div>
                </div>
                &nbsp;
                <div className="record-component__button" onClick={() => setTop(!top)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <If if={top}>
                            <path d="M6 4h12v2H6zm5 4v6H6l6 6 6-6h-5V8z"></path>
                        </If>
                        <If if={!top}>
                            <path d="M6 18h12v2H6zm6-14-6 6h5v6h2v-6h5z"></path>
                        </If>
                    </svg>
                    <div className="record-component__button-text">Move to {top ? 'bottom' : 'top'}</div>
                </div>
                <div style={{ width: 20 }} />
                <div
                    className="record-component__thumb"
                    style={{ display: (video || audio) && recording ? 'flex' : 'none' }}
                >
                    <If if={!video}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 16c2.206 0 4-1.794 4-4V6c0-2.217-1.785-4.021-3.979-4.021a.933.933 0 0 0-.209.025A4.006 4.006 0 0 0 8 6v6c0 2.206 1.794 4 4 4z"></path>
                            <path d="M11 19.931V22h2v-2.069c3.939-.495 7-3.858 7-7.931h-2c0 3.309-2.691 6-6 6s-6-2.691-6-6H4c0 4.072 3.061 7.436 7 7.931z"></path>
                        </svg>
                    </If>

                    <video
                        muted
                        ref={thumbnailRef}
                        autoplay
                        className="record-component__video"
                        style={{ display: video ? 'block' : 'none' }}
                    />
                </div>
            </div>
        </>
    )
}

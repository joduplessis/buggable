import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { record } from 'rrweb'
import './app.css'
import { ButtonComponent } from './components/button/button.component'
import { CompletedComponent } from './components/completed/completed.component'
import { CreditsComponent } from './components/credits/credits.component'
import { ErrorComponent } from './components/error/error.component'
import { If } from './components/if/if'
import { LauncherComponent } from './components/launcher/launcher.component'
import { LoadingComponent } from './components/loading/loading.component'
import { ModalComponent } from './components/modal/modal.component'
import { AttachmentsComponent, ToolsComponent } from './components/attachments/attachments.component'
import { ACTION, API_HOST, ASSETS, ATTACHMENT_TYPE, EMAIL_DOMAIN, MODULE, SCREENSHOTTER } from './constants'
import {
    bindEvent,
    classNames,
    deleteFiles,
    getConsoleLog,
    highestZIndex,
    request,
    uploadFile,
    userContext,
} from './helpers/util'
import { ActionComponent } from './components/action/action.component'
import { RecordComponent } from './components/record/record.component'

export const App = (props) => {
    const fileRef = useRef()
    const iframeRef = useRef()
    const { widget, button } = props
    const { shortcode, settings } = widget
    const { context, theme } = settings
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [module, setModule] = useState(null)
    const [zIndex, setZIndex] = useState(1000)
    const [action, setAction] = useState(null)
    const [attachments, setAttachments] = useState([])

    const handleActionFieldUpdate = (value, index1) => {
        setAction({
            ...action,
            fields: action.fields.map((field, index2) => {
                if (index1 == index2) {
                    return { ...field, value }
                } else {
                    return field
                }
            }),
        })
    }

    const handleAttachmentSelect = (attachment) => {
        switch (attachment) {
            case ATTACHMENT_TYPE.RECORDING:
                setModule(MODULE.RECORDING)
                break
            case ATTACHMENT_TYPE.SCREENSHOT:
                initModuleScreenshot()
                setModule(MODULE.SCREENSHOT)
                break
            case ATTACHMENT_TYPE.FILE:
                fileRef.current.click()
                break
        }
    }

    const handleActionSelect = (action) => {
        if (!action.exec) {
            setAction(action)
        } else {
            eval(action.exec)
            handleAppUnload()
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        setCompleted(false)

        try {
            const { title, description, rating, email, meta } = getIssueProperties(action.fields)

            await request({
                url: `${API_HOST}/widget`,
                method: 'POST',
                headers: {
                    authorization: shortcode,
                },
                body: {
                    title,
                    description,
                    rating,
                    email,
                    meta,
                    context: userContext(),
                    type: 'deprecated',
                    attachments,
                    session: {
                        events: window[SCREENSHOTTER.RRWEB_EVENTS],
                        logs: getConsoleLog(),
                    },
                },
            })

            setCompleted(true)
            setLoading(false)
        } catch (e) {
            setLoading(false)
            setError('Could not send report')
        }
    }

    const handleAppUnload = () => {
        const el = document.getElementById(shortcode)
        ReactDOM.unmountComponentAtNode(el)
        el.remove()
    }

    const handleFileChange = async (e) => {
        if (e.target.files.length == 0) return

        setLoading(true)
        setError(null)

        try {
            const file = e.target.files[0]
            const { name } = file
            const meta = { type: file.type || 'application/octet-stream' }
            const type = ATTACHMENT_TYPE.FILE
            const { url } = await uploadFile(file)
            const attachment = { name, type, url, meta }

            setLoading(false)
            setAttachments([...attachments, attachment])
        } catch (e) {
            setError('Error uploading file')
            setLoading(false)
        }
    }

    const handleAttachmentDelete = (index) => {
        const { url, name, type, meta } = attachments[index]
        const filenames = [url]

        // If there are any screenshot.comments.attachments
        // then we need to take note of them (to delete)
        if (type == ATTACHMENT_TYPE.SCREENSHOT) {
            meta.comments.map(({ attachments }) => {
                if (attachments) {
                    attachments.map(({ url }) => filenames.push(url))
                }
            })
        }

        // If there are any recording uploads
        // then we need to delete them too
        if (type == ATTACHMENT_TYPE.RECORDING) {
            if (meta.screenUrl) filenames.push(meta.screenUrl)
            if (meta.cameraUrl) filenames.push(meta.cameraUrl)
        }

        // We don't need to wait for this to complete
        // just remove it from the sevrer
        deleteFiles(filenames, shortcode)

        // Remove it from the UI
        setAttachments(attachments.filter((_, i) => i != index))
    }

    const initModuleScreenshot = () => {
        const zIndex = highestZIndex()

        const iframe = document.createElement('iframe')
        const head = document.createElement('head')
        const body = document.createElement('body')
        const div = document.createElement('div')
        const meta1 = document.createElement('meta')
        const meta2 = document.createElement('meta')

        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.top = '0px'
        iframe.style.left = '0px'
        iframe.style.position = 'fixed'
        iframe.style.zIndex = zIndex * 1000
        iframe.className = 'app-module'
        iframe.id = 'screenshotter-screenshot'

        document.body.appendChild(iframe)

        iframeRef.current = iframe

        div.setAttribute('id', 'root')
        div.className = 'root'

        meta1.setAttribute('charset', 'utf-8')
        meta2.setAttribute('content', 'width=device-width,initial-scale=1')
        meta2.setAttribute('name', 'viewport')

        head.appendChild(meta1)
        head.appendChild(meta2)
        body.appendChild(div)

        // Styles
        ASSETS.link.map((href) => {
            let link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            head.appendChild(link)
        })

        // Scripts
        ASSETS.script.map((src) => {
            let script = document.createElement('script')
            script.setAttribute('src', src)
            script.async = false
            body.appendChild(script)
        })

        const doc = iframe.contentDocument

        doc.head.parentNode.replaceChild(head, doc.head)
        doc.body.parentNode.replaceChild(body, doc.body)
    }

    const removeRecordingModule = () => {
        setModule(null)
    }

    const removeScreenshotModule = () => {
        document.getElementById('screenshotter-screenshot').remove()
        iframeRef.current.remove()
    }

    const initRrweb = () => {
        record({
            emit(event) {
                window[SCREENSHOTTER.RRWEB_EVENTS] = [...window[SCREENSHOTTER.RRWEB_EVENTS], event]
            },
        })
    }

    const initEventListener = () => {
        bindEvent(window, 'message', (e) => {
            setModule(null)

            switch (e.data.type) {
                case SCREENSHOTTER.EVENTS.CLOSE:
                    removeScreenshotModule()
                    removeRecordingModule()
                    break
                case SCREENSHOTTER.EVENTS.SAVE.SCREENSHOT:
                    setAttachments([...attachments, e.data.payload])
                    removeScreenshotModule()
                    break
                case SCREENSHOTTER.EVENTS.SAVE.RECORDING:
                    setAttachments([...attachments, e.data.payload])
                    removeRecordingModule()
                    break
            }
        })

        bindEvent(window, 'scroll', (e) => {
            if (settings.context) handleAppUnload()
        })
    }

    useEffect(() => {
        initRrweb()
        initEventListener()
        setZIndex(highestZIndex())
    }, [])

    return (
        <>
            <If if={!module}>
                <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileChange} />

                <ModalComponent
                    theme={theme}
                    context={context}
                    onDismiss={handleAppUnload}
                    onBack={() => setAction(null)}
                    action={action}
                    button={button}
                >
                    <LoadingComponent loading={loading} />
                    <ErrorComponent error={error} />

                    <If if={completed}>
                        <CompletedComponent />
                    </If>

                    <If if={!action}>
                        <LauncherComponent
                            onAttachmentSelect={handleAttachmentSelect}
                            onActionSelect={handleActionSelect}
                            settings={widget.settings}
                        />
                    </If>

                    {!!action && (
                        <>
                            <ActionComponent
                                text={action.text}
                                subtext={action.subtext}
                                icon={action.icon}
                                type={action.type}
                                exec={action.exec}
                                fields={action.fields}
                                onActionFieldUpdate={handleActionFieldUpdate}
                            />

                            <AttachmentsComponent
                                attachments={attachments}
                                onAttachmentDelete={handleAttachmentDelete}
                                onAttachmentSelect={handleAttachmentSelect}
                                settings={widget.settings}
                            />

                            <ButtonComponent onClick={handleSubmit}>{settings.submit}</ButtonComponent>
                        </>
                    )}

                    <If if={!context}>
                        <CreditsComponent />
                    </If>
                </ModalComponent>
            </If>

            <If if={module == MODULE.RECORDING}>
                <RecordComponent
                    zIndex={zIndex}
                    onCancel={() => setModule(null)}
                    onDone={({ meta: { screenUrl, cameraUrl }, name, media, url, type }) => {
                        console.log({ meta: { screenUrl, cameraUrl }, name, media, url, type })
                    }}
                />
            </If>
        </>
    )
}

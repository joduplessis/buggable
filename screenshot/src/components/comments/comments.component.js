import React, { useEffect, useRef, useState } from 'react'
import './comments.component.css'
import { TextareaComponent } from '../textarea/textarea.component'
import { IconComponent } from '../icon/icon.component'
import { classNames, sendMessageToParent, bindEvent, dataURLtoFile, uploadFile } from '../../helpers/util'

export function CommentsComponent(props) {
    const [value, setValue] = useState('')

    return (
        <div className="comments-component">
            <div className="comments-component__comment">
                {/*

                <div className="comments-component__comment-audio">
                    <div className="comments-component__comment-audio-play">
                        <IconComponent icon="play" color="white" size={12} />
                    </div>
                </div> */}

                <div className="comments-component__comment-id">
                    <div className="comments-component__comment-id-number">#1</div>
                    <div className="comments-component__comment-id-text"> @ screenshot 1</div>
                </div>

                <div className="comments-component__comment-text">
                    This text should be this large, can we please try something smaller? Or maybe we can decrease the
                    actual word count.
                </div>

                <div className="comments-component__comment-meta">
                    <div className="comments-component__comment-meta-date">5d ago</div>
                    <div className="comments-component__comment-meta-tool">
                        <IconComponent icon="attachment" color="#adb5be" size={12} />
                        <div className="comments-component__comment-meta-tool-text">2</div>
                    </div>
                    <div className="comments-component__comment-meta-tool">
                        <IconComponent icon="comment" color="#adb5be" size={12} />
                        <div className="comments-component__comment-meta-tool-text">3</div>
                    </div>
                    <div className="comments-component__comment-meta-tool">
                        <IconComponent icon="pen" color="#adb5be" size={12} />
                    </div>
                    <div className="comments-component__comment-meta-tool">
                        <IconComponent icon="delete" color="#adb5be" size={12} />
                    </div>
                </div>

                {/*
                <div className="comments-component__comment-files">
                    <div className="comments-component__comment-file">
                        <IconComponent icon="attachment" color="#adb5be" size={12} />
                        <div className="comments-component__comment-file-name">Updated changes.docx</div>
                        <IconComponent icon="delete" color="#adb5be" size={12} />
                    </div>
                    <div className="comments-component__comment-file">
                        <IconComponent icon="attachment" color="#adb5be" size={12} />
                        <div className="comments-component__comment-file-name">Layout idea.pdf</div>
                        <IconComponent icon="delete" color="#adb5be" size={12} />
                    </div>
                </div>

                <div className="comments-component__comment-replies">
                    <div className="comments-component__comment-reply">
                        <strong>@you</strong> Okay great, will have a look
                    </div>

                    <div className="comments-component__comment-reply">
                        <strong>@hellouser</strong> Thanks!
                    </div>
                </div>

                <TextareaComponent
                    className="comments-component__comment-textarea"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onEnter={() => console.log('Send')}
                    placeholder="Type & press enter"
                /> */}
            </div>
        </div>
    )
}

/*
function CommentComponent(props) {
    const [position, setPosition] = useState({
        active: false,
        offset: {},
    })
    const [editable, setEditable] = useState(false)
    const fileRef = useRef(null)

    const handlePointerDown = (e) => {
        const el = e.target
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        el.setPointerCapture(e.pointerId)
        setPosition({
            active: true,
            offset: { x, y },
        })
    }

    const handlePointerMove = (e) => {
        const bbox = e.target.getBoundingClientRect()
        const x = e.clientX - bbox.left
        const y = e.clientY - bbox.top
        if (position.active) {
            props.onUpdate({
                x: props.text.x - (position.offset.x - x),
                y: props.text.y - (position.offset.y - y),
            })
        }
    }

    const handlePointerUp = (e) => {
        setPosition({
            ...position,
            active: false,
        })
    }

    const handleUpload = async (e) => {
        if (e.target.files.length == 0) return

        try {
            const file = e.target.files[0]
            const { url } = await uploadFile(file)
            const { name } = file

            props.onAttachmentAdd({ url, name })
        } catch (e) {
            console.log(e)
        }
    }

    const renderAttachments = () => {
        return props.text.attachments.map((attachment, index) => (
            <div className="text-component__attachment" key={index}>
                <a className="text-component__attachment-text" href={attachment.url} target="_blank">
                    {attachment.name}
                </a>
                {editable && (
                    <div
                        className="text-component__attachment-icon"
                        onClick={() => {
                            if (confirm('Are you sure?')) props.onAttachmentDelete(index)
                        }}
                    >
                        <IconComponent icon="x" color="#343b40" size={12} />
                    </div>
                )}
            </div>
        ))
    }

    useEffect(() => {
        setEditable(true)
    }, [props.text])

    return (
        <div
            className="text-component"
            style={{ left: props.text.x, top: props.text.y }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleUpload} />

            <div className="text-component__number" onClick={() => setEditable(true)}>
                #{props.index + 1}
            </div>

            {!editable && (
                <>
                    <div className="text-component__editicon" onClick={() => setEditable(true)}>
                        <IconComponent icon="pen" color="#ffafbb" size={12} />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: props.text.text }} />
                    {renderAttachments()}
                    <div style={{ height: 10 }} />
                </>
            )}

            {editable && (
                <>
                    <TextareaComponent
                        className="text-component__textarea"
                        value={props.text.text}
                        onChange={(e) => props.onUpdate({ text: e.target.value })}
                        onEnter={() => setEditable(false)}
                    />
                    {renderAttachments()}
                    <div className="text-component__tools">
                        <div className="text-component__tool" onClick={() => fileRef.current.click()}>
                            Upload
                        </div>
                        <div className="text-component__tool" onClick={() => setEditable(false)}>
                            Save
                        </div>
                        <div className="text-component__tool" onClick={props.onDelete}>
                            Delete
                        </div>
                    </div>
                </>
            )}


            <div className="comments-component__comments">
                <div className="comments-component__comment">
                    <div className="comments-component__comment-user">You</div>
                    <div className="comments-component__comment-text">
                        hi this is a comment of some sort that the user can see
                    </div>
                </div>
                <div className="comments-component__comment screenshotter">
                    <div className="comments-component__comment-user">@inbox.dev.app</div>
                    <div className="comments-component__comment-text">
                        hi this is a comment of some sort that the user can see
                    </div>
                </div>
            </div>
            <div className="comments-component__input">
                <TextareaComponent
                    className="comments-component__textarea"
                    value=""
                    placeholder="Enter text & press enter"
                    onChange={(e) => props.onUpdate({ text: e.target.value })}
                    onEnter={() => setEditable(false)}
                />
            </div>

        </div>
    )
}
 */

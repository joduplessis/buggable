import React, { useRef } from 'react'
import { ATTACHMENT_TYPE, FILE, MODULE } from '../../constants'
import { uploadFile } from '../../helpers/util'
import './attachments.component.css'
import { If } from '../if/if'

export function AttachmentsComponent({ onAttachmentSelect, onAttachmentDelete, attachments, settings }) {
    if (!settings.attachments.recording && !settings.attachments.screenshot && !settings.attachments.file) return null

    return (
        <div className="screenshotter__attachments-component">
            <div className="screenshotter__attachments-component__tools">
                <If if={!!settings.attachments.file}>
                    <div
                        className="screenshotter__attachments-component__tool"
                        onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.FILE)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"
                        >
                            <path d="M17.004,5C17.002,5,17.001,5,17,5h-0.001H9C7.162,5,5.414,5.737,4.076,7.076C2.737,8.415,2,10.163,2,12 c0,1.838,0.737,3.586,2.076,4.924C5.414,18.263,7.162,19,9,19h8v-2H9c-1.303,0-2.55-0.529-3.51-1.49C4.529,14.55,4,13.303,4,12 c0-1.302,0.529-2.549,1.49-3.51C6.45,7.529,7.697,7,9,7h8V6l0.001,1c0.001,0,0.002,0,0.003,0c0.79,0,1.539,0.314,2.109,0.886 c0.571,0.571,0.886,1.322,0.887,2.116c0.001,0.789-0.313,1.539-0.884,2.11C18.543,12.684,17.791,12.999,17,13H9 c-0.256,0-0.505-0.107-0.698-0.3C8.107,12.505,8,12.256,8,12c0-0.252,0.11-0.507,0.301-0.698C8.495,11.107,8.744,11,9,11h8V9H9 C8.21,9,7.459,9.315,6.886,9.889C6.314,10.461,6,11.211,6,12s0.314,1.54,0.888,2.114C7.46,14.686,8.211,15,9,15h8.001 c1.324-0.001,2.577-0.523,3.528-1.473c0.951-0.95,1.473-2.204,1.471-3.528c-0.001-1.326-0.524-2.579-1.472-3.527 C19.58,5.522,18.328,5,17.004,5z"></path>
                        </svg>
                        <div className="screenshotter__attachments-component__tool-text">
                            {settings.attachments.file}
                        </div>
                    </div>
                </If>

                <If if={!!settings.attachments.screenshot}>
                    <div
                        className="screenshotter__attachments-component__tool"
                        onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.SCREENSHOT)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"
                        >
                            <path d="M19 14L17 14 17 17 14 17 14 19 17 19 17 22 19 22 19 19 22 19 22 17 19 17zM4 19h3v-2H5v-2H3v3C3 18.553 3.447 19 4 19zM19 4c0-.553-.447-1-1-1h-3v2h2v2h2V4zM5 5h2V3H4C3.447 3 3 3.447 3 4v3h2V5zM3 9H5V13H3zM17 9H19V12H17zM9 3H13V5H9zM9 17H12V19H9z"></path>
                        </svg>
                        <div className="screenshotter__attachments-component__tool-text">
                            {settings.attachments.screenshot}
                        </div>
                    </div>
                </If>

                <If if={!!settings.attachments.recording}>
                    <div
                        className="screenshotter__attachments-component__tool"
                        onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.RECORDING)}
                    >
                        <svg
                            viewBox="64 64 896 896"
                            focusable="false"
                            width="22"
                            height="22"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path>
                        </svg>
                        <div className="screenshotter__attachments-component__tool-text">
                            {settings.attachments.recording}
                        </div>
                    </div>
                </If>
            </div>

            <div className="screenshotter__attachments-component__attachments">
                {attachments.map((attachment, index) => {
                    return (
                        <div className="screenshotter__attachments-component__attachment" key={index}>
                            <div className="screenshotter__attachments-component__attachment-icon">
                                <If if={attachment.media == MODULE.RECORDING}>
                                    <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        width="22"
                                        height="22"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560zm176-167l-104-59.8V458.9L888 399v226zM208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"></path>
                                    </svg>
                                </If>
                                <If if={attachment.media == MODULE.SCREENSHOT}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"
                                    >
                                        <path d="M19 14L17 14 17 17 14 17 14 19 17 19 17 22 19 22 19 19 22 19 22 17 19 17zM4 19h3v-2H5v-2H3v3C3 18.553 3.447 19 4 19zM19 4c0-.553-.447-1-1-1h-3v2h2v2h2V4zM5 5h2V3H4C3.447 3 3 3.447 3 4v3h2V5zM3 9H5V13H3zM17 9H19V12H17zM9 3H13V5H9zM9 17H12V19H9z"></path>
                                    </svg>
                                </If>
                                <If if={attachment.media == FILE}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"
                                    >
                                        <path d="M17.004,5C17.002,5,17.001,5,17,5h-0.001H9C7.162,5,5.414,5.737,4.076,7.076C2.737,8.415,2,10.163,2,12 c0,1.838,0.737,3.586,2.076,4.924C5.414,18.263,7.162,19,9,19h8v-2H9c-1.303,0-2.55-0.529-3.51-1.49C4.529,14.55,4,13.303,4,12 c0-1.302,0.529-2.549,1.49-3.51C6.45,7.529,7.697,7,9,7h8V6l0.001,1c0.001,0,0.002,0,0.003,0c0.79,0,1.539,0.314,2.109,0.886 c0.571,0.571,0.886,1.322,0.887,2.116c0.001,0.789-0.313,1.539-0.884,2.11C18.543,12.684,17.791,12.999,17,13H9 c-0.256,0-0.505-0.107-0.698-0.3C8.107,12.505,8,12.256,8,12c0-0.252,0.11-0.507,0.301-0.698C8.495,11.107,8.744,11,9,11h8V9H9 C8.21,9,7.459,9.315,6.886,9.889C6.314,10.461,6,11.211,6,12s0.314,1.54,0.888,2.114C7.46,14.686,8.211,15,9,15h8.001 c1.324-0.001,2.577-0.523,3.528-1.473c0.951-0.95,1.473-2.204,1.471-3.528c-0.001-1.326-0.524-2.579-1.472-3.527 C19.58,5.522,18.328,5,17.004,5z"></path>
                                    </svg>
                                </If>
                            </div>
                            <a
                                className="screenshotter__attachments-component__attachment-name"
                                href="#"
                                alt={attachment.name}
                                target="_blank"
                            >
                                {attachment.name}
                            </a>
                            <div
                                className="screenshotter__attachments-component__attachment-delete"
                                onClick={() => (confirm('Are you sure?') ? onAttachmentDelete(index) : null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    style="fill:rgba(0, 0, 0, 1);transform:;-ms-filter:"
                                >
                                    <path d="M15,2H9C7.897,2,7,2.897,7,4v2H3v2h2v12c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-4V4C17,2.897,16.103,2,15,2z M9,4h6v2H9V4z M17,20H7V8h1h8h1V20z"></path>
                                </svg>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

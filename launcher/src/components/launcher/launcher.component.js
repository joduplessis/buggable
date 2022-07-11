import React from 'react'
import { ATTACHMENT_TYPE } from '../../constants'
import { If } from '../if/if'
import './launcher.component.css'

const Tool = (props) => {
    return (
        <div className="screenshotter__launcher-component__tool" onClick={props.onClick}>
            <div className="screenshotter__launcher-component__tool-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    {props.icon}
                </svg>
            </div>
            <div className="screenshotter__launcher-component__tool-text">{props.title}</div>
        </div>
    )
}

export function LauncherComponent({ settings, onActionSelect, onAttachmentSelect }) {
    const { context, theme, logo, background, heading, subheading, actions, attachments, information } = settings
    const showHeader = (!!logo.trim() || !!heading.trim() || !!subheading.trim()) && !context
    const showTools = !!attachments.recording || !!attachments.screenshot || !!attachments.file
    const showInformation = !!information.text.trim()
    const showFooter = (showTools || showInformation) && !context

    return (
        <div className="screenshotter__launcher-component theme">
            <If if={showHeader}>
                <div className="screenshotter__launcher-component__header">
                    <div
                        className="screenshotter__launcher-component__header-logo"
                        style={{ backgroundImage: `url(${background})` }}
                    >
                        <div className="screenshotter__launcher-component__header-logo-image">
                            <img src={logo} />
                        </div>
                    </div>
                    <div className="screenshotter__launcher-component__header-heading">{heading}</div>
                    <div className="screenshotter__launcher-component__header-subheading">{subheading}</div>
                </div>
            </If>

            <div className="screenshotter__launcher-component__actions">
                {actions.map((action, index) => {
                    return (
                        <div
                            className="screenshotter__launcher-component__action"
                            onClick={() => onActionSelect(action)}
                            key={index}
                        >
                            <div className="screenshotter__launcher-component__action-icon">
                                <img src={action.icon_dark} />
                            </div>
                            <div className="screenshotter__launcher-component__action-text">
                                <div className="screenshotter__launcher-component__action-text-text">{action.text}</div>
                                <div className="screenshotter__launcher-component__action-text-subtext">
                                    {action.subtext}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <If if={showFooter}>
                <div className="screenshotter__launcher-component__footer">
                    <If if={showTools}>
                        <div className="screenshotter__launcher-component__footer-panel">
                            <div className="screenshotter__launcher-component__resources">
                                <div className="screenshotter__launcher-component__tools">
                                    <If if={!!attachments.file}>
                                        <Tool
                                            onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.FILE)}
                                            title={attachments.file}
                                            icon={
                                                <path d="M17.004,5C17.002,5,17.001,5,17,5h-0.001H9C7.162,5,5.414,5.737,4.076,7.076C2.737,8.415,2,10.163,2,12 c0,1.838,0.737,3.586,2.076,4.924C5.414,18.263,7.162,19,9,19h8v-2H9c-1.303,0-2.55-0.529-3.51-1.49C4.529,14.55,4,13.303,4,12 c0-1.302,0.529-2.549,1.49-3.51C6.45,7.529,7.697,7,9,7h8V6l0.001,1c0.001,0,0.002,0,0.003,0c0.79,0,1.539,0.314,2.109,0.886 c0.571,0.571,0.886,1.322,0.887,2.116c0.001,0.789-0.313,1.539-0.884,2.11C18.543,12.684,17.791,12.999,17,13H9 c-0.256,0-0.505-0.107-0.698-0.3C8.107,12.505,8,12.256,8,12c0-0.252,0.11-0.507,0.301-0.698C8.495,11.107,8.744,11,9,11h8V9H9 C8.21,9,7.459,9.315,6.886,9.889C6.314,10.461,6,11.211,6,12s0.314,1.54,0.888,2.114C7.46,14.686,8.211,15,9,15h8.001 c1.324-0.001,2.577-0.523,3.528-1.473c0.951-0.95,1.473-2.204,1.471-3.528c-0.001-1.326-0.524-2.579-1.472-3.527 C19.58,5.522,18.328,5,17.004,5z"></path>
                                            }
                                        />
                                    </If>

                                    <If if={!!attachments.recording}>
                                        <Tool
                                            onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.RECORDING)}
                                            title={attachments.recording}
                                            icon={
                                                <path d="M18 7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.333L22 17V7l-4 3.333V7zm-1.998 10H4V7h12l.001 4.999L16 12l.001.001.001 4.999z"></path>
                                            }
                                        />
                                    </If>

                                    <If if={!!attachments.screenshot}>
                                        <Tool
                                            onClick={() => onAttachmentSelect(ATTACHMENT_TYPE.SCREENSHOT)}
                                            title={attachments.screenshot}
                                            icon={
                                                <path d="M19 14L17 14 17 17 14 17 14 19 17 19 17 22 19 22 19 19 22 19 22 17 19 17zM4 19h3v-2H5v-2H3v3C3 18.553 3.447 19 4 19zM19 4c0-.553-.447-1-1-1h-3v2h2v2h2V4zM5 5h2V3H4C3.447 3 3 3.447 3 4v3h2V5zM3 9H5V13H3zM17 9H19V12H17zM9 3H13V5H9zM9 17H12V19H9z"></path>
                                            }
                                        />
                                    </If>
                                </div>
                            </div>
                        </div>
                    </If>

                    <If if={showInformation}>
                        <div className="screenshotter__launcher-component__footer-panel">
                            <div className="screenshotter__launcher-component__resources">
                                <div className="screenshotter__launcher-component__resource-heading">
                                    {information.title}
                                </div>
                                <div className="screenshotter__launcher-component__resources-content">
                                    {information.text}
                                </div>
                            </div>
                        </div>
                    </If>
                </div>
            </If>
        </div>
    )
}

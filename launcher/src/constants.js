import * as environment from './environment'

export const NODE_ENV = environment.NODE_ENV
export const API_HOST = environment.API_HOST
export const CSS_HOST = environment.CSS_HOST
export const ASSETS = environment.ASSETS
export const EMAIL_DOMAIN = environment.EMAIL_DOMAIN
export const TYPE = {
    BUG: 'Bug',
    FEATURE: 'Feature',
    GENERAL: 'General',
    RATING: 'Rating',
    EMAIL: 'Email',
    CUSTOM: 'Custom',
}
export const ACTION = {
    BUG: 'Bug',
    FEATURE: 'Feature',
    GENERAL: 'General',
    RATING: 'Rating',
    CUSTOM: 'Custom',
}
export const PROPERTY = {
    TITLE: 'TITLE',
    DESCRIPTION: 'DESCRIPTION',
    RATING: 'RATING',
    EMAIL: 'EMAIL',
}
export const FIELD_TYPE = {
    TEXT: 'TEXT',
    TEXTAREA: 'TEXTAREA',
    RATING: 'RATING',
    EMAIL: 'EMAIL',
}
export const ATTACHMENT_TYPE = {
    FILE: 'File',
    SCREENSHOT: 'Screenshot',
    RECORDING: 'Recording',
}
export const VIEW = {
    LAUNCHER: 'LAUNCHER',
    GENERAL: 'GENERAL',
    BUG: 'BUG',
    FEATURE: 'FEATURE',
    RECORD: 'RECORD',
}
export const RECORDING = 'RECORDING'
export const BUG = 'BUG'
export const FEATURE = 'FEATURE'
export const GENERAL = 'GENERAL'
export const RECORD = 'RECORD'
export const LAUNCHER = 'LAUNCHER'
export const SCREENSHOTTER_CLOSE = 'SCREENSHOTTER_CLOSE'
export const SCREENSHOTTER_SAVE = 'SCREENSHOTTER_SAVE'
export const FILE = 'FILE'
export const RATING = 'RATING'
export const MEDIA = {
    RECORDING: 'RECORDING',
    SCREENSHOT: 'SCREENSHOT',
    FILE: 'FILE',
}
export const MODULE = {
    RECORDING: 'RECORDING',
    SCREENSHOT: 'SCREENSHOT',
    FILE: 'FILE',
}
export const POSITIONS = {
    TOP_LEFT: 'TOP_LEFT',
    TOP_CENTER: 'TOP_CENTER',
    TOP_RIGHT: 'TOP_RIGHT',
    CENTER_LEFT: 'CENTER_LEFT',
    CENTER_RIGHT: 'CENTER_RIGHT',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_CENTER: 'BOTTOM_CENTER',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT',
}
export const SCREENSHOTTER_WIDGET = 'SCREENSHOTTER_WIDGET'
export const SCREENSHOTTER_LOG = 'SCREENSHOTTER_LOG'
export const SCREENSHOTTER = {
    RRWEB_EVENTS: 'RRWEB_EVENTS',
    THEME: 'THEME',
    LOG: 'SCREENSHOTTER_LOG',
    WIDGET: 'SCREENSHOTTER_WIDGET',
    WIDGETS: 'SCREENSHOTTER_WIDGETS',
    EVENTS: {
        CLOSE: 'SCREENSHOTTER_EVENTS_CLOSE',
        SAVE: {
            SCREENSHOT: 'SCREENSHOTTER_EVENTS_SAVE_SCREENSHOT',
            RECORDING: 'SCREENSHOTTER_EVENTS_SAVE_RECORDING',
        },
    },
}
export const THEME = {
    DARK: 'DARK',
    LIGHT: 'LIGHT',
}

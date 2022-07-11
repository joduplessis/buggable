import * as environment from './environment'

// Environment specific variables
export const API_HOST = environment.API_HOST
export const NODE_ENV = environment.NODE_ENV
export const SENTRY_DSN = environment.SENTRY_DSN
export const AUTH0_DOMAIN = environment.AUTH0_DOMAIN
export const AUTH0_CLIENTID = environment.AUTH0_CLIENTID
export const AUTH0_AUDIENCE = environment.AUTH0_AUDIENCE

export const S3_URL_PATH = environment.S3_URL_PATH

export const TOP = 'TOP'
export const BOTTOM = 'BOTTOM'
export const LEFT = 'LEFT'
export const RIGHT = 'RIGHT'
export const FREEHAND = 'FREEHAND'
export const CIRCLE = 'CIRCLE'
export const RECTANGLE = 'RECTANGLE'
export const COMMENT = 'COMMENT'
export const ARROW = 'ARROW'
export const ELLIPSE = 'ELLIPSE'
export const DELETE = 'DELETE'
export const SCREENSHOTTER_CLOSE = 'SCREENSHOTTER_CLOSE'
export const SCREENSHOTTER_SAVE = 'SCREENSHOTTER_SAVE'
export const AUDIO = 'AUDIO'
export const FILE = 'FILE'
export const RECORDING = 'RECORDING'
export const SCREENSHOT = 'SCREENSHOT'
export const COLORS = [
    '#B9255F',
    '#DB4035',
    '#FF9933',
    '#FAD100',
    '#B0B73B',
    '#7FCC48',
    '#289438',
    '#6BCBBC',
    '#188FAD',
    '#16AAF5',
    '#98C3EA',
    '#4074FE',
    '#884EFF',
    '#B038EB',
    '#EB96EB',
    '#E15293',
    '#FE8C85',
    '#808080',
    '#B8B8B8',
    '#4a5057',
    'transparent',
]
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

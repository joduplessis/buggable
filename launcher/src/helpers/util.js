import { NODE_ENV, CSS_HOST, SCREENSHOTTER, SCREENSHOTTER_LOG, ASSETS, PROPERTY, THEME } from '../constants'
import React from 'react'
import ReactDOM from 'react-dom'
import { App } from '../app'

export const getThemeClass = (theme) => {
    return !!theme ? theme.toUpperCase() : isDarkMode() ? THEME.DARK : THEME.LIGHT
}

export const isDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const getIssueProperties = (fields) => {
    let title = fields.find((field) => field.property == PROPERTY.TITLE)
    let description = fields.find((field) => field.property == PROPERTY.DESCRIPTION)
    let rating = fields.find((field) => field.property == PROPERTY.RATING)
    let email = fields.find((field) => field.property == PROPERTY.EMAIL)
    let meta = {}

    // go over any unmatched properties and add them to the meta object
    fields.map((field) => {
        if (
            field.property != PROPERTY.TITLE &&
            field.property != PROPERTY.DESCRIPTION &&
            field.property != PROPERTY.RATING &&
            field.property != PROPERTY.EMAIL
        ) {
            meta[field.property] = field.value
        }
    })

    return {
        title,
        description,
        rating,
        email,
        meta,
    }
}

export const initLauncher = (widgets) => {
    window[SCREENSHOTTER.WIDGETS] = widgets
    window[SCREENSHOTTER.RRWEB_EVENTS] = []

    // Add event listeners to each button
    // There might be different widgets
    Array.from(document.querySelectorAll('[data-screenshotter]')).map((target, index) => {
        target.addEventListener('click', (e) => {
            createWidget(target.getAttribute('data-screenshotter'), e.target)
        })
    })
}

export const initButtons = () => {
    // TODO: Migrate this to the data attribute way above
    window[SCREENSHOTTER.WIDGETS].map((widget) => {
        const {
            settings: { button },
        } = widget

        if (button.active) {
            const buttonEl = document.createElement('button')

            buttonEl.innerText = button.text
            buttonEl.className = 'screenshotter__button ' + button.position.toLowerCase().replace('_', '-')
            buttonEl.style.backgroundColor = button.color.background
            buttonEl.style.color = button.color.text
            buttonEl.style.borderColor = button.color.border
            buttonEl.style.zIndex = highestZIndex()

            buttonEl.addEventListener('click', (e) => {
                createWidget(widget.shortcode, e.target)
            })

            document.body.appendChild(buttonEl)
        }
    })
}

export const initStyles = () => {
    // Local builds will add the css file automatically
    // So only on prod & dev do we want this to happen
    if (NODE_ENV == 'local') return

    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `${CSS_HOST}/screenshotter.css`
    head.appendChild(link)
}

export const initLogging = () => {
    window[SCREENSHOTTER_LOG] = []

    const oldLog = console.log
    const oldWarn = console.warn
    const oldInfo = console.info
    const oldError = console.error
    const oldDebug = console.debug
    const oldAssert = console.assert

    const log = (type, value) => {
        window[SCREENSHOTTER.LOG] = [...window[SCREENSHOTTER.LOG], { type, value }]
    }

    console.log = function (message) {
        oldLog.apply(console, arguments)
        log('log', Array.from(arguments))
    }

    console.warn = function (message) {
        oldWarn.apply(console, arguments)
        log('warn', Array.from(arguments))
    }

    console.info = function (message) {
        oldInfo.apply(console, arguments)
        log('info', Array.from(arguments))
    }

    console.error = function (message) {
        oldError.apply(console, arguments)
        log('error', Array.from(arguments))
    }

    console.debug = function (message) {
        oldDebug.apply(console, arguments)
        log('debug', Array.from(arguments))
    }

    console.assert = function (message) {
        oldAssert.apply(console, arguments)
        log('assert', Array.from(arguments))
    }
}

const createWidget = (shortcode, button) => {
    if (!document.getElementById(shortcode)) {
        const widget = window[SCREENSHOTTER.WIDGETS].find((widget) => widget.shortcode == shortcode)
        const div = document.createElement('div')
        div.id = shortcode
        document.body.appendChild(div)
        ReactDOM.render(<App widget={widget} button={button} />, div)
    }
}

export const getInboxShortcode = () => {
    const script = document.getElementById('screenshotter')
    return script ? script.getAttribute('screenshotter') : null
}

export const deleteFiles = (filenames, shortcode) => {
    request({
        url: `${API_HOST}/public/delete-files`,
        method: 'POST',
        headers: {
            authorization: shortcode,
        },
        body: JSON.stringify({ filenames }),
    })
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
}

export const getConsoleLog = () => {
    return window[SCREENSHOTTER.LOG] || []
}

export function setCookie(name, val) {
    const date = new Date()
    const value = val

    // Set it expire in 7 days
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Set it
    document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/'
}

export function getCookie(name) {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')

    if (parts.length == 2) {
        return parts.pop().split(';').shift()
    }
}

export function deleteCookie(name) {
    const date = new Date()

    // Set it expire in -1 days
    date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000)

    // Set it
    document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/'
}

export const classNames = (object) => {
    const classArray = []

    for (let property in object) {
        if (object[property]) classArray.push(property)
    }

    return classArray.join(' ')
}

export const blobToFile = (blob, filename) => {
    blob.lastModifiedDate = new Date()
    blob.name = filename

    return blob
}

export function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const { name, type } = file
        const url = S3_URL_PATH + '?mime=' + type + '&filename=' + name
        const request1 = new XMLHttpRequest()

        request1.addEventListener('load', function () {
            const response = JSON.parse(this.responseText)
            const s3Url = response.url
            const urlWithoutQueryString = s3Url.split('?')[0]
            const request2 = new XMLHttpRequest()

            request2.open('PUT', s3Url, true)
            request2.setRequestHeader('Content-Type', type)
            request2.setRequestHeader('x-amz-acl', 'private')
            request2.send(file)

            // Make the request
            request2.onloadend = function (e) {
                resolve({ url: urlWithoutQueryString })
            }
            request2.onreadystatechange = function () {
                if (this.readyState === XMLHttpRequest.DONE && (this.status === 201 || this.status === 200)) {
                    console.log('http.onreadystatechange::DONE')
                } else {
                    console.log('http.onreadystatechange::BUSY')
                }
            }
        })
        request1.open('GET', url)
        request1.send()
    })
}

export function request(opts) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest()

        xhr.open(opts.method, opts.url)
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText,
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText,
            })
        }

        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key])
            })
        }

        if (typeof opts.body == 'object') {
            console.log('ed')
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        }

        xhr.send(opts.body ? JSON.stringify(opts.body) : null)
    })
}

export function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false)
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler)
    }
}

export function highestZIndex() {
    return Array.from(document.querySelectorAll('body *'))
        .map((a) => parseFloat(window.getComputedStyle(a).zIndex))
        .filter((a) => !isNaN(a))
        .sort()
        .pop()
}

export function stopCapture(evt) {
    let tracks = videoElem.srcObject.getTracks()

    tracks.forEach((track) => track.stop())
    videoElem.srcObject = null
}

export const base64Encode = (str) => {
    var BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var o1
    var o2
    var o3
    var h1
    var h2
    var h3
    var h4
    var bits
    var i = 0
    var ac = 0
    var enc
    var tmp_arr = []

    if (!str) {
        return str
    }

    str = unescape(encodeURIComponent(str))

    do {
        o1 = str.charCodeAt(i++)
        o2 = str.charCodeAt(i++)
        o3 = str.charCodeAt(i++)
        bits = (o1 << 16) | (o2 << 8) | o3
        h1 = (bits >> 18) & 0x3f
        h2 = (bits >> 12) & 0x3f
        h3 = (bits >> 6) & 0x3f
        h4 = bits & 0x3f
        tmp_arr[ac++] = BASE64.charAt(h1) + BASE64.charAt(h2) + BASE64.charAt(h3) + BASE64.charAt(h4)
    } while (i < str.length)

    enc = tmp_arr.join('')
    var r = str.length % 3

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
}

export const userContext = () => {
    const { screen, location, document, navigator } = window
    const body = document.body || document.getElementsByTagName('body').item(0) || null

    const browser = () => {
        const { userAgent } = navigator
        let match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
        let temp

        if (/trident/i.test(match[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(userAgent) || []

            return `IE ${temp[1] || ''}`
        }

        if (match[1] === 'Chrome') {
            temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/)

            if (temp !== null) {
                return temp.slice(1).join(' ').replace('OPR', 'Opera')
            }

            temp = userAgent.match(/\b(Edg)\/(\d+)/)

            if (temp !== null) {
                return temp.slice(1).join(' ').replace('Edg', 'Edge (Chromium)')
            }
        }

        match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?']
        temp = userAgent.match(/version\/(\d+)/i)

        if (temp !== null) {
            match.splice(1, 1, temp[1])
        }

        return match.join(' ')
    }

    const timestamp = () => {
        return new Date().getTime()
    }

    const timezone = () => {
        return new Date().getTimezoneOffset()
    }

    const url = () => {
        return location.href || null
    }

    const referrer = () => {
        return document.referrer && document.referrer.trim().length > 0 ? document.referrer.trim() : null
    }

    const userAgent = () => {
        return navigator.userAgent || null
    }

    const platform = () => {
        return navigator.platform || null
    }

    const language = () => {
        return navigator.language || null
    }

    const languages = () => {
        return navigator.languages || null
    }

    const doNotTrackEnabled = () => {
        const dnt = navigator.doNotTrack || navigator.msDoNotTrack
        return !!(dnt === 'yes' || dnt === '1')
    }

    const cookieEnabled = () => {
        return navigator.cookieEnabled || null
    }

    const screenColorDepth = () => {
        return screen.colorDepth || null
    }

    const screenWidth = () => {
        return screen.width || null
    }

    const screenHeight = () => {
        return screen.height || null
    }

    const windowWidth = () => {
        return screen.availWidth || null
    }

    const windowHeight = () => {
        return screen.availHeight || null
    }

    const viewportWidth = () => {
        return (
            window.innerWidth ||
            document_ELEMENT.clientWidth ||
            body.clientWidth ||
            document_ELEMENT.offsetWidth ||
            body.offsetWidth ||
            null
        )
    }

    const viewportHeight = () => {
        return (
            window.innerHeight ||
            document_ELEMENT.clientHeight ||
            body.clientHeight ||
            document_ELEMENT.offsetHeight ||
            body.offsetHeight ||
            null
        )
    }

    const documentTitle = () => {
        return document.title || null
    }

    const documentCharset = () => {
        return document.characterSet || document.charset || null
    }

    return {
        browser: browser(),
        timestamp: timestamp(),
        timezone: timezone(),
        url: url(),
        referrer: referrer(),
        user_agent: userAgent(),
        platform: platform(),
        language: language(),
        languages: languages(),
        cookie_enabled: cookieEnabled(),
        dnt_enabled: doNotTrackEnabled(),
        screen_color_depth: screenColorDepth(),
        screen_width: screenWidth(),
        screen_height: screenHeight(),
        window_width: windowWidth(),
        window_height: windowHeight(),
        viewport_width: viewportWidth(),
        viewport_height: viewportHeight(),
        document_title: documentTitle(),
        document_charset: documentCharset(),
    }
}

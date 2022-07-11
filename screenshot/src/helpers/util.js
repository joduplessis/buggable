import { NODE_ENV, S3_URL_PATH } from '../constants'

export const sendMessageToParent = ({ type, payload }) => {
    window.parent.postMessage({ type, payload }, '*')
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
            request2.onloadend = (e) => {
                resolve({ url: urlWithoutQueryString, type })
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

export function bindEvent(element, eventName, eventHandler) {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false)
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventName, eventHandler)
    }
}

export const createURLQueryString = (parameters) => {
    const params = []
    for (let parameter in parameters) {
        params.push(parameter + '=' + parameters[parameter])
    }
    return params.join('&')
}

export const getQueryStringValue = (name) => {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export const bytesToSize = (bytes) => {
    let sizes = ['bytes', 'kb', 'mb', 'gb', 'tb']
    if (bytes == 0) return '0 Byte'
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export const urlParser = (url) => {
    if (!url) return false
    if (typeof url != 'string') return false

    const match = url.match(/(http[s]?:\/\/.*)/i)
    return match ? match[0].split(' ') : false
}

export const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export const showLocalPushNotification = (title, body) => {
    navigator.serviceWorker.ready.then((register) => {
        const serviceWorkerRegistration = register

        if (serviceWorkerRegistration) {
            serviceWorkerRegistration.showNotification(title, {
                body,
                icon: '',
                image: '',
            })
        }
    })
}

export const copyToClipboard = (value) => {
    const tempInput = document.createElement('input')
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px;'
    tempInput.value = value
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand('copy')
    document.body.removeChild(tempInput)
}

export const logger = function () {
    if (NODE_ENV == 'development') {
        for (let argument of arguments) {
            console.log(argument)
        }
    }
}

export const isValidEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export const decimalToMinutes = (minutes) => {
    let sign = minutes < 0 ? '-' : ''
    let min = Math.floor(Math.abs(minutes))
    let sec = Math.floor((Math.abs(minutes) * 60) % 60)
    return sign + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec
}

export const stripSpecialChars = (text) => {
    return text ? text.replace(/[`~!@#$%^&*()|+\= ?;:'",.<>\{\}\[\]\\\/]/gi, '') : ''
}

export const validateEmail = (email) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
}

export const classNames = (object) => {
    const classArray = []

    for (let property in object) {
        if (object[property]) classArray.push(property)
    }

    return classArray.join(' ')
}

export const findRoleTypeWithRoleId = (roles, roleId) => {
    return roles.reduce((acc, val) => {
        if (val.id == roleId) {
            return acc + val.type
        } else {
            return acc + ''
        }
    }, '')
}

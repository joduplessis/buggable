import { getInboxShortcode, initButtons, initLauncher, initLogging, initStyles } from './helpers/util'
import './styles.css'

const shortcode = getInboxShortcode()

const widgetObj = (position) => {
    return {
        shortcode: 'SCREENSHOTTER-jln13jln123',
        settings: {
            context: false,
            button: {
                active: true,
                color: {
                    text: '#00EFCF',
                    background: '#001639',
                    border: 'transparent',
                },
                text: 'Give Feedback',
                position,
            },
            submit: 'Send',
            theme: '', // LIGHT/DARK/EMPTY for auto
            logo: 'https://joduplessis.com/static/img/avatar.9a00d50.png',
            background: 'https://pbs.twimg.com/profile_banners/19925686/1603620193/1500x500',
            heading: 'A modern user feedback stack for everyone.',
            subheading: 'Level up your product by giving your users the tools they need to report bugs, send feedback.',
            actions: [
                {
                    text: 'Request a feature',
                    subtext: 'Something that you would like to see',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3914/3914396.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225731.png?token=exp=1657569854~hmac=76ff4df9b60727ff4d4ed75decd5bc79',
                    type: 'TID1',
                    exec: '',
                    fields: [
                        {
                            label: 'This is a single text',
                            description: 'Some text description what you should do with this field',
                            type: 'TEXT',
                            placeholder: 'Single placeholder',
                            value: '',
                            property: 'TITLE',
                        },
                        {
                            label: 'This is a multi text',
                            description: '',
                            type: 'TEXTAREA',
                            placeholder: 'Multi placeholder',
                            value: '',
                            property: 'DESCRIPTION',
                        },
                        {
                            label: 'This is a rating',
                            description: '',
                            type: 'RATING',
                            placeholder: 'Rating placeholder',
                            value: '',
                            property: 'RATING',
                        },
                        {
                            label: 'This is an email',
                            description: '',
                            type: 'EMAIL',
                            placeholder: 'Email placeholder',
                            value: '',
                            property: 'EMAIL',
                        },
                    ],
                },
                {
                    text: 'Report a bug',
                    subtext: 'Report something that has gone wrong.',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3917/3917577.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225678.png?token=exp=1657569854~hmac=62be12b6b8752fd5352df54e45cafad1',
                    type: 'TID2',
                    exec: '',
                    fields: [],
                },
                {
                    text: 'Give us your opinion',
                    subtext: 'Let us know any general feedback.',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3914/3914404.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225581.png?token=exp=1657569854~hmac=e54a5f9c95bb83bd1d2f57c3dcb58b88',
                    type: 'TID3',
                    exec: '',
                    fields: [],
                },
                {
                    text: 'Rate your experience',
                    subtext: '',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3916/3916582.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225596.png?token=exp=1657569854~hmac=208562e3b66e6c2c4289d96b5e6cea4c',
                    type: 'TID4',
                    exec: '',
                    fields: [],
                },
                {
                    text: 'Email us directly',
                    subtext: '',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3917/3917567.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225744.png?token=exp=1657569854~hmac=16d827a7f606f8edabe165640738b716',
                    type: '',
                    exec: 'window.open(`mailto:123`)',
                    fields: [],
                },
                {
                    text: 'Launch our help center',
                    subtext: '',
                    icon: 'https://cdn-icons-png.flaticon.com/128/3916/3916685.png',
                    icon_dark:
                        'https://cdn-icons.flaticon.com/png/512/4225/premium/4225588.png?token=exp=1657569854~hmac=348378b65dc3047f73fd86f9b2d61ad8',
                    type: '',
                    exec: 'alert("Testing!")',
                    fields: [],
                },
            ],
            attachments: {
                recording: 'Record',
                screenshot: 'Screenshot',
                file: 'File',
            },
            information: {
                title: 'We are running a competition!',
                text: 'Check it out our website for more information.',
            },
        },
    }
}

const widgets = [widgetObj('TOP_LEFT')]

/**
widgetObj('TOP_LEFT'),
widgetObj('TOP_CENTER'),
widgetObj('TOP_RIGHT'),
widgetObj('CENTER_LEFT'),
widgetObj('CENTER_RIGHT'),
widgetObj('BOTTOM_LEFT'),
widgetObj('BOTTOM_CENTER'),
widgetObj('BOTTOM_RIGHT'),
 */

initStyles()
initLogging()
initLauncher(widgets)
initButtons()

setTimeout(() => {
    Array.from(document.querySelectorAll('[data-screenshotter]'))[0].click()
}, 500)

/*
if (!!shortcode) {
    request({
        url: `${API_HOST}/public/inbox`,
        method: 'GET',
        headers: { authorization: shortcode },
    })
        .then((result) => {
            initStyles()
            initLogging()
            initLauncher(JSON.parse(result))
        })
        .catch((error) => console.error(widget, error))
} */

// Listen for manual triggers
/*
window.addEventListener(
    'message',
    (event) => {
        if (event.origin !== location.origin) return
        if (!event.data) return
        if (!event.data.widgetId) return
        if (!event.data.type) return
        if (event.data.type == SCREENSHOTTER_WIDGET) createWidget(event.data.widgetId)
    },
    false
)
*/

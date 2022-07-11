import React from 'react'
import { BiX, BiLeftArrowAlt } from 'react-icons/bi'

const Icons = {
    back: BiLeftArrowAlt,
    close: BiX,
}

export function IconComponent({ size, color, icon }) {
    let iconComponent = null

    for (const property in Icons) {
        const Component = Icons[property]
        if (property == icon) {
            iconComponent = <Component size={size} width={size} height={size} color={color} />
        }
    }

    return iconComponent
}

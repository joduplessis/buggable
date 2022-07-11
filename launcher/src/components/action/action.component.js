import React, { useState } from 'react'
import './action.component.css'
import { InputComponent } from '../input/input.component'
import { TextareaComponent } from '../textarea/textarea.component'
import { FIELD_TYPE } from '../../constants'
import { RatingComponent } from '../rating/rating.component'
import { If } from '../if/if'

const Field = ({ type, label, description, placeholder, value, onChange }) => {
    const getInputField = () => {
        switch (type) {
            case FIELD_TYPE.EMAIL:
                return InputComponent
            case FIELD_TYPE.TEXT:
                return InputComponent
            case FIELD_TYPE.TEXTAREA:
                return TextareaComponent
            case FIELD_TYPE.RATING:
                return RatingComponent
            default:
                return null
        }
    }

    const Input = getInputField()

    return (
        <>
            <If if={label}>
                <div className="screenshotter__action-component-label">{label}</div>
            </If>
            <If if={description}>
                <div className="screenshotter__action-component-description">{description}</div>
            </If>
            <Input placeholder={placeholder} value={value} onChange={onChange} />
        </>
    )
}

export function ActionComponent({ text, subtext, icon, type, exec, fields, onActionFieldUpdate }) {
    return (
        <div className="screenshotter__action-component">
            {fields.map((field, index) => {
                return (
                    <Field
                        key={index}
                        label={field.label}
                        description={field.description}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(value) => onActionFieldUpdate(value, index)}
                    />
                )
            })}
        </div>
    )
}

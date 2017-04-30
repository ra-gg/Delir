import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as classnames from 'classnames'

interface LabelInputProps {
    className?: string
    name?: string
    defaultValue?: string
    placeholder?: string
    onChange?: (value: string) => void
    doubleClickToEdit?: boolean
}

interface LabelInputState {
    readOnly: boolean
    value: string|undefined
}

export default class LabelInput extends React.Component<LabelInputProps, LabelInputState>
{
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        defaultValue: PropTypes.string,
        placeholder: PropTypes.string,
        onChange: PropTypes.func,
        doubleClickToEdit: PropTypes.bool,
    }

    static defaultProps = {
        doubleClickToEdit: false,
    }

    refs: {
        input: HTMLInputElement,
    }

    state = {
        readOnly: true,
        value: this.props.defaultValue,
    }

    enableAndFocus()
    {
        this.setState({readOnly: false})
        this.refs.input.focus()
        this.refs.input.select()
    }

    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    {
        const {refs: {input}, props: {onChange, defaultValue}} = this

        if (e.key === 'Enter') {
            if (this.state.readOnly) {
                this.enableAndFocus()
            } else {
                onChange && onChange(input.value)
                this.setState({readOnly: true, value: input.value})
            }
        } else if (e.key === 'Escape') {
            onChange && onChange(input.value)
            this.setState({readOnly: true, value: defaultValue || ''})
        }
    }

    onBlur = (e: React.MouseEvent<HTMLInputElement>) =>
    {
        if (this.state.readOnly) return

        this.props.onChange && this.props.onChange(this.refs.input.value)
        this.setState({readOnly: true})
    }

    onDoubleClick = (e: React.MouseEvent<HTMLInputElement>) =>
    {
        if (!this.props.doubleClickToEdit) return

        e.preventDefault()
        e.stopPropagation()

        this.setState({readOnly: false})
        this.refs.input.focus()
        this.refs.input.select()
    }

    valueChanged = e =>
    {
        this.setState({value: this.refs.input.value})
    }

    render()
    {
        const {
            props: {className, name, placeholder},
            state: {value, readOnly},
        } = this

        return (
            <input
                ref='input'
                type='text'
                tabIndex={-1}
                className={classnames('_label-input', className)}
                name={name}
                value={value}
                placeholder={placeholder}
                readOnly={readOnly}
                onChange={this.valueChanged}
                onKeyDown={this.onKeyDown}
                onBlur={this.onBlur}
                onDoubleClick={this.onDoubleClick}
            />
        )
    }
}

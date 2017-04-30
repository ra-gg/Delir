import React from 'react'
import * as PropTypes from 'prop-types'
import {remote} from 'electron'

import EditorStateStore from '../stores/editor-state-store'
import EditorStateActions from '../actions/editor-state-actions'

import Pane from './components/pane'

export default class StatusView extends React.Component
{
    constructor(...args)
    {
        super(...args)
        this.state = {
            stateText: EditorStateStore.getState().processingState,
        }

        EditorStateStore.addListener(() => {
            this.setState({
                stateText: EditorStateStore.getState().processingState,
            })
        })
    }

    openFeedback = (e) =>
    {
        remote.shell.openExternal('https://goo.gl/forms/dDy7HWgPuAiOFaSn1')
        e.preventDefault()
    }

    render()
    {
        return (
            <Pane className='view-status' resizable={false} allowFocus={false}>
                <style scoped>
                    {`
                        a {
                            color:white;
                            textDecoration:none;
                            float:right;
                            padding: 0 4px;
                        }
                        a:hover {
                            background-color: rgba(255, 255, 255, .2);
                        }
                    `}
                </style>
                <div>{this.state.stateText}</div>
                <div>
                    <a href='#' target='_blank' onClick={this.openFeedback}>Feedback</a>
                </div>
            </Pane>
        )
    }
}

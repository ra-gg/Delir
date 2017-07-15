import * as React from 'react'

import Workspace from '../components/workspace'
import Pane from '../components/pane'

import AppMenu from '../AppMenu'
import AssetsView from '../AssetsView'
import PreviewView from '../PreviewView/'
import TimelineView from '../TimelineView'
import NavigationView from '../NavigationView'
import StatusBar from '../StatusBar'
import Notifications from '../Notifications'

export default class AppView extends React.Component<null, null>
{
    componentDidMount()
    {
        window.addEventListener('dragenter', this.prevent, false)
        window.addEventListener('dragover', this.prevent, false)
    }

    prevent = (e: any) => {
        e.preventDefault()
    }

    render()
    {
        return (
            <div className='_container' onDrop={this.prevent}>
                <AppMenu />
                <NavigationView />
                <Workspace className='app-body' direction='vertical'>
                    <Pane className='body-pane'>
                        <Workspace direction='horizontal'>
                            <AssetsView />
                            <PreviewView />
                        </Workspace>
                    </Pane>
                    <TimelineView />
                </Workspace>
                <StatusBar />
                <Notifications />
            </div>
        )
    }
}

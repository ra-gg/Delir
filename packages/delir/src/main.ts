// import * as os from 'os'
import Fleur from '@ragg/fleur'
import { createElementWithContext } from '@ragg/fleur-react'
import * as ReactDOM from 'react-dom'

// import * as AppActions from './actions/App'
// import Monaco from './utils/Monaco'

import EditorStateStore from './stores/EditorStateStore'
import ProjectStore from './stores/ProjectStore'
import AppView from './views/AppView'

import './global-styles'

// import * as Delir from '@ragg/delir-core'
// import RendererService from './services/renderer'

// // Handle errors
// process.on('uncaughtException', (e: Error) => {
//     // tslint:disable-next-line: no-console
//     console.error(e)
//     AppActions.notify(e.message, '😱Uncaught Exception😱', 'error', 5000, e.stack)
// })

// process.on('uncaughtRejection', (e: Error) => {
//     // tslint:disable-next-line: no-console
//     console.error(e)
//     AppActions.notify(e.message, '😱Uncaught Rejection😱', 'error', 5000, e.stack)
// })

document.addEventListener('DOMContentLoaded', async () => {
    // initialize app
    // await RendererService.initialize()
    // await Monaco.setup()

    // Attach platform class to body element
    // switch (os.type()) {
    //     case 'Windows_NT': document.body.classList.add('platform-win'); break
    //     case 'Darwin': document.body.classList.add('platform-mac'); break
    //     case 'Linux': document.body.classList.add('platform-linux'); break
    // }

    const mountPoint = document.createElement('div')
    document.body.appendChild(mountPoint)

    const app = new Fleur({
        stores: [ EditorStateStore, ProjectStore ]
    })
    const context = app.createContext()

    ReactDOM.render(
        createElementWithContext(context, AppView, {}),
        mountPoint,
        () => {
            // (document.querySelector('#loading') as HTMLElement).style.display = 'none'
        }
    )

    // AppActions.setActiveProject(new Delir.Project.Project())

    // if (__DEV__) {
    //     require('./utils/Dev/example-project/ExampleProject1')
    //     AppActions.notify('It\'s experimental VFX Application works with JavaScript', '👐 <DEV MODE> Hello, welcome to Delir', 'info')
    // }

    // RendererService.renderer.setDestinationAudioNode(audioContext.destination)
})

// window.delir = Delir
